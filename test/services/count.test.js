const assert = require('assert');
const app = require('../../src/app');

describe('\'count\' service', () => {
  it('registered the service', () => {
    const service = app.service('count');

    assert.ok(service, 'Registered the service');
  });
});
