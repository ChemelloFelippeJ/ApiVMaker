# api.video NodeJS SDK

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/ApiVideo/nodejs-sdk/badges/quality-score.png?b=master&s=93531b005797e4b690cdbbe8459be0f75f1f3e6f)](https://scrutinizer-ci.com/g/ApiVideo/nodejs-sdk/?branch=master)
[![Build Status](https://scrutinizer-ci.com/g/ApiVideo/nodejs-sdk/badges/build.png?b=master&s=e01c30ae25aa2b0472299c1d961faf67e48bda65)](https://scrutinizer-ci.com/g/ApiVideo/nodejs-sdk/build-status/master)

The [api.video](https://api.video/) web-service helps you put video on the web without the hassle. 
This documentation helps you use the corresponding NodeJS client.
 
## Quick start

Install:

```shell
 npm install @api.video/nodejs-sdk
```

Usage:

```javascript
const apiVideo = require('@api.video/nodejs-sdk');



// Create client for Production and authenticate
const client = new apiVideo.Client({ apiKey: 'xxx' });

// Create client for Sandbox and authenticate
const client = new apiVideo.ClientSandbox({ apiKey: 'xxx' });

// Create and upload a video ressource
let result = client.videos.upload('/path/to/video.mp4', {title: 'Course #4 - Part B'});

result.then(function(video) {
  console.log(video.title);
}).catch(function(error) {
  console.error(error);
});

// Update video properties
let result = client.videos.update('viXxxxXxxxXxxxxxxxXX', {description: 'Course #4 - Part B'});

result.then(function(video) {
  console.log(video.description);
});

// Search video by tags filter and paginate results
let result = client.videos.search({currentPage: 1, pageSize: 25, tags: ['finance']});

result.then(function(videos) {
  for (let x = 0; x < videos.length; x += 1) {
    if (Object.prototype.hasOwnProperty.call(videos, x)) {
      let video = videos[x];
      console.log(video.title);
    }
  }
});

// Delete video ressource
let result = client.videos.delete('viXxxxXxxxXxxxxxxxXX');
result.then(function(statusCode) {
  console.log(statusCode);
}).catch(function(error) {
  console.error(error);
});

// Upload a video thumbnail
let result = client.videos.uploadThumbnail('/path/to/thumbnail.jpg', 'viXxxxXxxxXxxxxxxxXX');

result.then(function(video) {
  console.log(video.title);
});

// Update video thumbnail by picking image with video timecode
let result = client.videos.updateThumbnailWithTimecode('viXxxxXxxxXxxxxxxxXX', '00:15:22.05');

result.then(function(video) {
  console.log(video.title);
});

// Create players with default values
let result = client.players.create();

result.then(function(player) {
  console.log(player.playerId);
});

// Get a player
let result = client.players.get('plXxxxXxxxXxxxxxxxXX');

result.then(function(player) {
  console.log(player.playerId);
});

// Search a player with paginate results
let result = client.players.search({currentPage: 1, pageSize: 50});

result.then(function(players) {
  for (let x = 0; x < players.length; x += 1) {
    if (Object.prototype.hasOwnProperty.call(players, x)) {
      let player = players[x];
      console.log(player.playerId);
    }
  }
});

let properties = {
  shapeMargin: 10,
  shapeRadius: 3,
  shapeAspect: "flat",
  shapeBackgroundTop: "rgba(50, 50, 50, .7)",
  shapeBackgroundBottom: "rgba(50, 50, 50, .8)",
  text: "rgba(255, 255, 255, .95)",
  link: "rgba(255, 0, 0, .95)",
  linkHover: "rgba(255, 255, 255, .75)",
  linkActive: "rgba(255, 0, 0, .75)",
  trackPlayed: "rgba(255, 255, 255, .95)",
  trackUnplayed: "rgba(255, 255, 255, .1)",
  trackBackground: "rgba(0, 0, 0, 0)",
  backgroundTop: "rgba(72, 4, 45, 1)",
  backgroundBottom: "rgba(94, 95, 89, 1)",
  backgroundText: "rgba(255, 255, 255, .95)",
  language: "en",
  enableApi: true,
  enableControls: true,
  forceAutoplay: false,
  hideTitle: true,
  forceLoop: true
};


let result = client.players.update('plXxxxXxxxXxxxxxxxXX', properties);

result.then(function(player) {
  console.log(player.forceLoop);
});


let result = client.players.delete('plXxxxXxxxXxxxxxxxXX');
result.then(function(statusCode) {
  console.log(statusCode);
}).catch(function(error) {
  console.error(error);
});


// Upload video caption
let result = client.captions.upload('path/to/caption.vtt', {videoId: 'viXxxxXxxxXxxxxxxxXX', language: 'en'});

result.then(function(caption) {
  console.log(caption.src);
});

// Get video caption by language
let result = client.captions.get('viXxxxXxxxXxxxxxxxXX', 'en');

result.then(function(caption) {
  console.log(caption.src);
});

// Update the default caption language
let result = client.captions.updateDefault('viXxxxXxxxXxxxxxxxXX', 'en', true);

result.then(function(caption) {
  console.log(caption.default);
});

//Delete caption by language
let result = client.captions.delete('viXxxxXxxxXxxxxxxxXX', 'en');
result.then(function(statusCode) {
  console.log(statusCode);
}).catch(function(error) {
  console.error(error);
});

// Create a live
let result = client.lives.create('This is a live');

result.then(function(live) {
  console.log(live.name);
});

// Get video Analytics Data for the month of July 2018
let result = client.analyticsVideo.get('viXxxxXxxxXxxxxxxxXX', '2019-01');

result.then(function(analyticVideo) {
  console.log(analyticVideo.data);
});

// Search Video Analytics Data for January 2019 and return the first 100 results
let result = client.analyticsVideo.search({currentPage: 1, pageSize: 100, period: '2019-01'});

result.then(function(analyticsVideo) {
  for (let x = 0; x < analyticsVideo.length; x += 1) {
    if (Object.prototype.hasOwnProperty.call(analyticsVideo, x)) {
      let analyticVideo = analyticsVideo[x];
      console.log(analyticVideo.data);
    }
  }
});

// Get live Analytics Data for the month of July 2018
let result = client.analyticsLive.get('liXxxxXxxxXxxxxxxxXX', '2019-01');

result.then(function(analyticLive) {
  console.log(analyticLive.data);
});

// Search Live Analytics Data between May 2018 and July 2018 and return the first 100 results
let result = client.analyticsLive.search({currentPage: 1, pageSize: 100, period: '2019-01'});

result.then(function(analyticsLive) {
  for (let x = 0; x < analyticsLive.length; x += 1) {
    if (Object.prototype.hasOwnProperty.call(analyticsLive, x)) {
      let analyticLive = analyticsLive[x];
      console.log(analyticLive.data);
    }
  }
});

// Get Analytics Session Events for a sessionId
let result = client.analyticsSessionEvent.get('psXxxxXxxxXxxxxxxxXX');

result.then(function(analyticSessionEvent) {
  console.log(analyticSessionEvent.events);
});


// Generate a token for delegated upload
let result = client.tokens.generate();
result.then(function(token) {
  console.log(token);
});
```

## Full API

```php
<?php
/*
 *********************************
 *********************************
 *         VIDEO                 *
 *********************************
 *********************************
*/
const client = new apiVideo.Client({ apiKey: 'xxx' });

// Show a video
client.videos.get(videoId);

// List or search videos
client.videos.search(parameters = {});

// Create video properties
client.videos.create(title, properties = {});

// Upload a video media file
// Create a video, if videoId is null
client.videos.upload(source, properties = {}, videoId = null);

// Create a video by downloading it from a third party
client.videos.download(source, title, properties = {});

// Update video properties
client.videos.update(videoId, properties);

// Set video public
client.videos.makePublic(videoId);

// Set video private
client.videos.makePrivate(videoId);

// Delete video (file and data)
client.videos.delete(videoId);


// Delegated upload (generate a token for someone to upload a video into your account)
result = client.tokens.generate(); // string(3): "xyz"
result.then(function(token) {
  // ...then upload from anywhere without authentication:
  //  curl https://ws.api.video/upload?token=xyz -F file=@video.mp4
});


/*
 *********************************
 *         VIDEO THUMBNAIL       *
 *********************************
*/

// Upload a thumbnail for video
client.videos.uploadThumbnail(source, videoId);

// Update video's thumbnail by picking timecode
client.videos.updateThumbnailWithTimecode(videoId, timecode);

/*
 *********************************
 *         VIDEO CAPTIONS        *
 *********************************
*/

// Get caption for a video
client.videos.captions.get(videoId, language);

// Get all captions for a video
client.videos.captions.getAll(videoId);

// Upload a caption file for a video (.vtt)
client.videos.captions.upload(source, properties);


// Set default caption for a video
client.videos.captions.updateDefault(videoId, language, isDefault);

// Delete video's caption
client.videos.captions.delete(videoId, language);


/*
 *********************************
 *         PLAYERS               *
 *********************************
*/

// Get a player
client.players.get(playerId);

// List players
client.players.search(parameters = {});

// Create a player
client.players.create(properties = {});

// Update player's properties
client.players.update(playerId, properties);

// Delete a player
client.players.delete(playerId);

/*
 *********************************
 *********************************
 *         LIVE                 *
 *********************************
 *********************************
*/

// Show a live
client.lives.get(liveStreamId);

// List or search lives
client.lives.search(parameters = {});

// Create live properties
client.lives.create(name, properties = {});

// Update live properties
client.lives.update(liveStreamId, properties);

// Delete live (file and data)
client.lives.delete(liveStreamId);

/*
 *********************************
 *         LIVE THUMBNAIL       *
 *********************************
*/

// Upload a thumbnail for live
client.lives.uploadThumbnail(source, liveStreamId);

/*
 *********************************
 *         ANALYTICS             *
 *********************************
*/

// Get video analytics between period
client.analyticsVideo.get(videoId, period);

// Search videos analytics between period, filter with tags or metadata
client.analyticsVideo.search(parameters);

// Get live analytics between period
client.analyticsLive.get(liveStreamId, period);

// Search lives analytics between period, filter with tags or metadata
client.analyticsLive.search(parameters);

// Get analytics session events
client.analyticsLive.get(sessionId, parameters);


```



## Full API Details Implementation


### Videos

|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **get**                          |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **search**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   parameters(object)   |    Search parameters       |   :x:                  |      <ul><li>currentPage(int)</li><li>pageSize(int)</li><li>sortBy(string)</li><li>sortOrder(string)</li><li>keyword(string)</li><li>tags(string&#124;array(string))</li><li>metadata(array(string))</li></ul>   |
|    **create**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   title(string)       |    Video title             |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Video properties        |   :x:                  |      <ul><li>description(string)</li><li>tags(array(string))</li><li>playerId(string)</li><li>metadata(array(<br/>array(<br/>'key' => 'Key1', <br/>'value' => 'value1'<br/>), <br/>array(<br/>'key' => 'Key2',<br/> 'value' => 'value2'<br/>)<br/>)</li></ul>  |
|    **upload**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   source(string)      |    Video media file        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Video properties        |   :x:                  |      <ul><li>title(string)</li><li>description(string)</li><li>tags(array(string))</li><li>playerId(string)</li><li>metadata(array(<br/>array(<br/>'key' => 'Key1', <br/>'value' => 'value1'<br/>), <br/>array(<br/>'key' => 'Key2',<br/> 'value' => 'value2'<br/>)<br/>)</li></ul>   |
|    **-**                            |   videoId(string)     |    Video identifier        |   :x:                  |      **-**             |
|    **uploadThumbnail**              |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   source(string)      |    Image media file        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **updateThumbnailWithTimeCode**  |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   timecode(string)    |    Video timecode          |   :heavy_check_mark:   |      00:00:00.00<br/>(hours:minutes:seconds.frames)       |
|    **update**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   videoId()string     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Video properties        |   :heavy_check_mark:   |      <ul><li>title(string)</li><li>description(string)</li><li>tags(array(string))</li><li>playerId(string)</li><li>metadata(array(<br/>array(<br/>'key' => 'Key1', <br/>'value' => 'value1'<br/>), <br/>array(<br/>'key' => 'Key2',<br/> 'value' => 'value2'<br/>)<br/>)</li></ul>  |
|    **makePublic**                   |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **makePrivate**                  |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **delete**                       |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
                                      
### Players                           
                                      
|     **Function**                    |   **Parameters**      |     **Description**        |      **Required**      |   **Allowed Values**   |
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------: |
|    **get**                          |   playerId(string)    |    Player identifier       |   :heavy_check_mark:   |      **-**             |
|    **create**                       |   properties(object)   |    Player properties       |   :x:                  |      <ul><li>shapeMargin(int)</li><li>shapeRadius(int)</li><li>shapeAspect(string)</li><li>shapeBackgroundTop(string)</li><li>shapeBackgroundBottom(string)</li><li>text(string)</li><li>link(string)</li><li>linkHover(string)</li><li>linkActive(string)</li><li>trackPlayed(string)</li><li>trackUnplayed(string)</li><li>trackBackground(string)</li><li>backgroundTop(string)</li><li>backgroundBottom(string)</li><li>backgroundText(string)</li><li>enableApi(bool)</li><li>enableControls(bool)</li><li>forceAutoplay(bool)</li><li>hideTitle(bool)</li></ul>             |
|    **search**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   parameters(object)   |    Search parameters       |   :x:                  |      <ul><li>currentPage(int)</li><li>pageSize(int)</li><li>sortBy(string)</li><li>sortOrder(string)</li></ul>   |
|    **update**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   playerId(string)    |    Player identifier       |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Player properties       |   :heavy_check_mark:   |      <ul><li>shapeMargin(int)</li><li>shapeRadius(int)</li><li>shapeAspect(string)</li><li>shapeBackgroundTop(string)</li><li>shapeBackgroundBottom(string)</li><li>text(string)</li><li>link(string)</li><li>linkHover(string)</li><li>linkActive(string)</li><li>trackPlayed(string)</li><li>trackUnplayed(string)</li><li>trackBackground(string)</li><li>backgroundTop(string)</li><li>backgroundBottom(string)</li><li>backgroundText(string)</li><li>enableApi(bool)</li><li>enableControls(bool)</li><li>forceAutoplay(bool)</li><li>hideTitle(bool)</li></ul>              |
|    **delete**                       |   playerId(string)    |    Player identifier       |   :heavy_check_mark:   |      **-**             |
                                      
### Captions                          
                                      
|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values**   |
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------: |
|    **get**                          |   **-**               |    **-**                   |    **-**               |      **-**             |
|    **-**                            |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   language(string)    |    Language identifier     |   :heavy_check_mark:   |      2 letters (ex: en, fr) |
|    **getAll**                       |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **upload**                       |   **-**               |    **-**                   |   -                    |      **-**             |
|    **-**                            |   source(string)      |    Caption file            |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(string)  |    Caption properties      |   :heavy_check_mark:   |      <ul><li>videoId(string)</li><li>language(string - 2 letters)</li></ul>   |
|    **updateDefault**                |   **-**     (object)   |    **-**                   |   -                    |      **-**             |
|    **-**                            |   videoId             |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   language  (string)  |    Language identifier     |   :heavy_check_mark:   |      2 letters (ex: en, fr)  |
|    **-**                            |   isDefault (string)  |    Set default language    |   :heavy_check_mark:   |      true/false             |
|    **delete**                       |   **-**              |    **-**                   |    -                   |      **-**             |
|    **-**                            |   videoId             |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   language  (string)  |    Language identifier     |   :heavy_check_mark:   |      2 letters (ex: en, fr)  |

### Lives

|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **get**                          |   liveStreamId(string)     |    Live identifier        |   :heavy_check_mark:   |      **-**             |
|    **search**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   parameters(object)   |    Search parameters       |   :x:                  |      <ul><li>currentPage(int)</li><li>pageSize(int)</li><li>sortBy(string)</li><li>sortOrder(string)</li></ul>   |
|    **create**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   name(string)        |    Live name             |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Live properties        |   :x:                  |      <ul><li>record(boolean)</li><li>playerId(string)</li></ul>  |
|    **uploadThumbnail**              |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   source(string)      |    Image media file        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   liveStreamId(string)     |    Live identifier        |   :heavy_check_mark:   |      **-**             |
|    **update**                       |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   liveStreamId()string     |    Live identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   properties(object)   |    Live properties        |   :heavy_check_mark:   |      <ul><li>title(string)</li><li>description(string)</li><li>tags(array(string))</li><li>playerId(string)</li><li>metadata(array(<br/>array(<br/>'key' => 'Key1', <br/>'value' => 'value1'<br/>), <br/>array(<br/>'key' => 'Key2',<br/> 'value' => 'value2'<br/>)<br/>)</li></ul>  |
|    **delete**                       |   liveStreamId(string)     |    Live identifier        |   :heavy_check_mark:   |      **-**             |
                                                     
### AnalyticsVideo                         
                                      
|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values/Format**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **get**                          |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   videoId(string)     |    Video identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   period (string)     |    Period research         |   :x:                  |      <ul><li>For a day : 2018-01-01</li><li>For a week: 2018-W01</li><li>For a month: 2018-01</li><li>For a year: 2018</li><li>Date range: 2018-01-01/2018-01-15</li><li>Week range: 2018-W01/2018-W03</li><li>Month range: 2018-01/2018-03</li><li>Year range: 2018/2020</li></ul>             |
|    **search**                       |   parameters(object)   |    Search parameters       |   :x:                  |      <ul><li>Pagination/Filters:</li><li>currentPage(int)</li><li>pageSize(int)</li><li>sortBy(string)</li><li>sortOrder(string)</li><li>tags(string&#124;array(string))</li><li>metadata(array(string))</li><li>Period:</li><li>For a day : 2018-01-01</li><li>For a week: 2018-W01</li><li>For a month: 2018-01</li><li>For a year: 2018</li><li>Date range: 2018-01-01/2018-01-15</li><li>Week range: 2018-W01/2018-W03</li><li>Month range: 2018-01/2018-03</li><li>Year range: 2018/2020</li></ul>             |

### AnalyticsLive                         
                                      
|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values/Format**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **get**                          |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   liveStreamId(string)     |    Live identifier        |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   period (string)     |    Period research         |   :x:                  |      <ul><li>For a day : 2018-01-01</li><li>For a week: 2018-W01</li><li>For a month: 2018-01</li><li>For a year: 2018</li><li>Date range: 2018-01-01/2018-01-15</li><li>Week range: 2018-W01/2018-W03</li><li>Month range: 2018-01/2018-03</li><li>Year range: 2018/2020</li></ul>             |
|    **search**                       |   parameters(object)   |    Search parameters       |   :x:                  |      <ul><li>Pagination/Filters:</li><li>currentPage(int)</li><li>pageSize(int)</li><li>sortBy(string)</li><li>sortOrder(string)</li><li>Period:</li><li>For a day : 2018-01-01</li><li>For a week: 2018-W01</li><li>For a month: 2018-01</li><li>For a year: 2018</li><li>Date range: 2018-01-01/2018-01-15</li><li>Week range: 2018-W01/2018-W03</li><li>Month range: 2018-01/2018-03</li><li>Year range: 2018/2020</li></ul>             |
                                                     
### AnalyticsSessionEvent                         
                                      
|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values/Format**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **get**                          |   **-**               |    **-**                   |   **-**                |      **-**             |
|    **-**                            |   sessionId(string)   |    Session identifier      |   :heavy_check_mark:   |      **-**             |
|    **-**                            |   parameters(array)   |    Search parameters       |   :x:                  |      <ul><li>currentPage(int)</li><li>pageSize(int)</li></ul>   |
                                              
### Tokens                         
                                      
|     **Function**                    |   **Parameters**      |      **Description**       |      **Required**      |   **Allowed Values**   |         
| :---------------------------------: | :-------------------: | :------------------------: | :--------------------: | :--------------------- |
|    **generate**                     |   **-**               | Token for delegated upload |   **-**                |      **-**             |
## More on api.video

A full technical documentation is available on https://docs.api.video/
