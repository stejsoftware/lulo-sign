// Initializes the `light` service on path `/light`
const createService = require('./light.class.js');
const hooks = require('./light.hooks');
const filters = require('./light.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'light',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/light', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('light');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
