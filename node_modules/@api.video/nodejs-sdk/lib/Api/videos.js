const arrayMerge     = require('locutus/php/array/array_merge');
const arrayMap       = require('locutus/php/array/array_map');
const fs             = require('fs');
const path           = require('path');
const os             = require('os');
const tempname       = require('tempnam');
const httpBuildQuery = require('locutus/php/url/http_build_query');
const Video          = require('../Model/video');

const Videos = function Videos(browser) {
    this.browser   = browser;
    this.chunkSize = 64 * 1024 * 1024;

    this.get = async function get(videoId) {
        const that     = this;
        const response = await this.browser.get(`/videos/${videoId}`);

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.create = async function create(title, properties = {}) {
        const that     = this;
        const response = await this.browser.post(
            '/videos',
            {},
            arrayMerge(properties, {title}),
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.search = async function search(parameters = {}) {
        const that         = this;
        const params       = parameters;
        const currentPage  = (typeof parameters.currentPage !== 'undefined')
            ? parameters.currentPage
            : 1;
        params.pageSize    = (typeof parameters.pageSize !== 'undefined')
            ? parameters.pageSize
            : 100;
        params.currentPage = currentPage;
        const allVideos    = [];
        let pagination     = {};

        /* eslint-disable no-await-in-loop */
        do {
            const response = await this.browser.get(
                `/videos?${httpBuildQuery(params)}`,
            );

            if (that.browser.isSuccessfull(response)) {
                const results = response.body;
                const videos  = results.data;
                allVideos.push(that.castAll(videos));

                if (typeof parameters.currentPage !== 'undefined') {
                    break;
                }

                ({pagination} = results);
                pagination.currentPage += 1;
                params.currentPage = pagination.currentPage;
            }
        } while (pagination.pagesTotal > pagination.currentPage);

        return new Promise((async (resolve, reject) => {
            try {
                let videos = [];
                if (Object.prototype.hasOwnProperty.call(allVideos, 0)) {
                    [videos] = allVideos;
                }
                for (let x = 1; x < allVideos.length; x += 1) {
                    if (Object.prototype.hasOwnProperty.call(allVideos, x)) {
                        arrayMerge(videos, allVideos[x]);
                    }
                }
                resolve(videos);
            } catch (e) {
                reject(e);
            }
        }));
    };

    this.download = async function download(source, title, properties = {}) {
        const parameters  = properties;
        parameters.source = source;

        return this.create(title, parameters);
    };

    this.upload = async function upload(source, properties = {}, videoId = null) {
        const that       = this;
        let slug         = videoId;
        const parameters = properties;
        if (!fs.existsSync(source)) {
            throw new Error(`${source} must be a readable source file`);
        }

        if (slug === null) {
            if (typeof parameters.title === 'undefined') {
                parameters.title = path.basename(source);
            }
            const video = await this.create(parameters.title, parameters);
            slug        = video.videoId;
        }

        const length = fs.statSync(source).size;

        if (length <= 0) {
            throw new Error(`${source} is empty`);
        }

        // Upload in a single request when file is small enough
        if (this.chunkSize > length) {
            const response = await this.browser.submit(
                `/videos/${slug}/source`,
                source,
            );
            return new Promise(((resolve, reject) => {
                if (!that.browser.isSuccessfull(response)) {
                    reject(response);
                } else {
                    const video = that.cast(response.body);
                    resolve(video);
                }
            }));
        }

        const readableStream = fs.createReadStream(source, {
            highWaterMark: this.chunkSize,
        });

        const chunks = [];
        readableStream.on('readable', async () => {
            const chunkPath = tempname.tempnamSync(os.tmpdir(), 'upload-chunk-');
            let chunk;
            while ((chunk = readableStream.read(that.chunkSize)) !== null) {
                fs.writeFileSync(chunkPath, chunk, {});
                chunks.push(chunkPath);
            }
        });

        let copiedBytes = 0;
        return new Promise((async (resolve, reject) => {
            let lastResponse = null;
            await readableStream.on('end',  () => {
                Object.keys(chunks).forEach(async (key) => {
                    const chunk     = chunks[key];
                    const chunkFile = fs.readFileSync(chunk);
                    const from      = copiedBytes;
                    copiedBytes += chunkFile.length;
                    lastResponse    = await that.browser.submit(
                        `/videos/${slug}/source`,
                        chunk,
                        {
                            'Content-Range': `bytes ${from}-${copiedBytes - 1}/${length}`,
                        },
                    ).catch((error) => {
                        throw new Error(error.message);
                    });
                    fs.unlinkSync(chunk);
                    if (that.browser.isSuccessfull(lastResponse)) {
                        if(lastResponse.headers['lastchunkextension']){
                            const video = that.cast(lastResponse.body);
                            resolve(video);
                        }
                    }
                });
            });
        }));
    };

    this.uploadThumbnail = async function uploadThumbnail(source, videoId) {
        const that = this;

        if (!fs.existsSync(source)) {
            throw new Error(`${source} must be a readable source file`);
        }

        const length = fs.statSync(source).size;

        if (length <= 0) {
            throw new Error(`${source} is empty`);
        }

        const response = await this.browser.submit(
            `/videos/${videoId}/thumbnail`,
            source,
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        })).catch((error) => {
            console.log(error);
        });
    };

    this.update = async function update(videoId, properties = {}) {
        const that     = this;
        const response = await this.browser.patch(
            `/videos/${videoId}`,
            {},
            properties,
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.makePublic = async function makePublic(videoId) {
        const that     = this;
        const response = await this.browser.patch(
            `/videos/${videoId}`,
            {},
            {public: true},
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.makePrivate = async function makePrivate(videoId) {
        const that     = this;
        const response = await this.browser.patch(
            `/videos/${videoId}`,
            {},
            {public: false},
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.updateThumbnailWithTimecode = async function updateThumbnailWithTimecode(
        videoId, timecode,
    ) {
        const that = this;
        if (!timecode) {
            throw new Error('Timecode is empty');
        }
        const response = await this.browser.patch(
            `/videos/${videoId}/thumbnail`,
            {},
            {timecode},
        );

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                const video = that.cast(response.body);
                resolve(video);
            }
        }));
    };

    this.delete = async function remove(videoId) {
        const that = this;

        const response = await this.browser.delete(`/videos/${videoId}`);

        return new Promise(((resolve, reject) => {
            if (!that.browser.isSuccessfull(response)) {
                reject(response);
            } else {
                resolve(response.statusCode);
            }
        }));
    };
};

Videos.prototype.castAll = function castAll(collection) {
    return arrayMap((data) => {
        const video       = new Video();
        video.videoId     = data.videoId;
        video.title       = data.title;
        video.description = data.description;
        video.public      = data.public;
        video.tags        = data.tags;
        video.metadata    = data.metadata;
        video.source      = data.source;
        video.publishedAt = data.publishedAt;
        video.assets      = data.assets;

        return video;
    }, collection);
};

Videos.prototype.cast = function cast(data) {
    if (!data) {
        return null;
    }

    const video       = new Video();
    video.videoId     = data.videoId;
    video.title       = data.title;
    video.description = data.description;
    video.public      = data.public;
    video.tags        = data.tags;
    video.metadata    = data.metadata;
    video.source      = data.source;
    video.publishedAt = data.publishedAt;
    video.assets      = data.assets;

    return video;
};

module.exports = Videos;
