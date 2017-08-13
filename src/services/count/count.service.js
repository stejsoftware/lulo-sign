// Initializes the `count` service on path `/count`
const createService = require('./count.class.js');
const hooks = require('./count.hooks');
const filters = require('./count.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'count',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/count', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('count');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
