const Tokens = function Tokens(browser) {
  this.browser = browser;

  this.generate = async function generate() {
    const that = this;
    const response = await this.browser.post('/tokens');

    return new Promise(((resolve, reject) => {
      if (!that.browser.isSuccessfull(response)) {
        reject(response);
      } else {
        const token = that.cast(response.body);
        resolve(token);
      }
    }));
  };
};

Tokens.prototype.cast = function cast(data) {
  if (!data) {
    return null;
  }

  return data.token;
};

module.exports = Tokens;
