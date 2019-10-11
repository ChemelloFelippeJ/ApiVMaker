class Video {
  constructor() {
    this.videoId = null;
    this.title = null;
    this.description = null;
    this.public = null;
    this.tags = [];
    this.metadata = [];
    this.source = null;
    this.assets = {};
    this.publishedAt = null;
    this.captions = {};
  }
}

module.exports = Video;
