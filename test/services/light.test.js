const assert = require('assert');
const app = require('../../src/app');

describe('\'light\' service', () => {
  it('registered the service', () => {
    const service = app.service('light');

    assert.ok(service, 'Registered the service');
  });
});
