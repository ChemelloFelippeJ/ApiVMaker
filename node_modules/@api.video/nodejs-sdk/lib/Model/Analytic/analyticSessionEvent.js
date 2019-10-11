const AnalyticSession = require('./analyticSession');
const AnalyticResource = require('./analyticResource');

class AnalyticSessionEvent {
  constructor() {
    this.session = new AnalyticSession();
    delete this.session.metadata;
    this.resource = new AnalyticResource();
    this.events = [];
  }
}

module.exports = AnalyticSessionEvent;
