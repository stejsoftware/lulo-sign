const light = require('./light/light.service.js');
const count = require('./count/count.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(light);
  app.configure(count);
};
