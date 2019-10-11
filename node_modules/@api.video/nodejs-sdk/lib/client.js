const Browser = require('./Browser/browser');
const Videos = require('./Api/videos');
const Lives = require('./Api/lives');
const Players = require('./Api/players');
const Captions = require('./Api/captions');
const AnalyticsVideo = require('./Api/analyticsVideo');
const AnalyticsLive = require('./Api/analyticsLive');
const AnalyticsSessionEvent = require('./Api/analyticsSessionEvent');
const Tokens = require('./Api/tokens');

const Client = function Client(config) {
  this.apiKey = config.apiKey;
  this.baseUri = 'https://ws.api.video';

  if (config.baseUri !== undefined) {
    this.baseUri = config.baseUri;
  }

  this.browser = new Browser(this.apiKey, this.baseUri);
  this.videos = new Videos(this.browser);
  this.lives = new Lives(this.browser);
  this.players = new Players(this.browser);
  this.captions = new Captions(this.browser);
  this.analyticsVideo = new AnalyticsVideo(this.browser);
  this.analyticsLive = new AnalyticsLive(this.browser);
  this.analyticsSessionEvent = new AnalyticsSessionEvent(this.browser);
  this.tokens = new Tokens(this.browser);
};

module.exports = Client;
