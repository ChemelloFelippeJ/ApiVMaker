const AnalyticSession = require('./analyticSession');
const AnalyticLocation = require('./analyticLocation');
const AnalyticReferer = require('./analyticReferer');
const AnalyticDevice = require('./analyticDevice');
const AnalyticOs = require('./analyticOs');
const AnalyticClient = require('./analyticClient');

class AnalyticData {
  constructor() {
    this.session = new AnalyticSession();
    this.location = new AnalyticLocation();
    this.referer = new AnalyticReferer();
    this.device = new AnalyticDevice();
    this.os = new AnalyticOs();
    this.client = new AnalyticClient();
  }
}

module.exports = AnalyticData;
