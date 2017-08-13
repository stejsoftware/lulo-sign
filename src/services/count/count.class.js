/* eslint-disable no-unused-vars */
const GPIO = require("onoff").Gpio;
const _ = require("lodash");

class Service {
  constructor(options) {
    this.options = options || {};
    this.docs = {
      description: "A service to set/get the count of the sign.",
      definitions: {
        count: {
          type: "object",
          properties: {
            number: {
              type: "integer",
              description: "the number displayed on the sign"
            }
          },
          required: ["number"],
          example: { number: 8888 }
        }
      }
    };
  }

  get(id, params) {
    return Promise.resolve({
      id,
      number: 0
    });
  }

  update(id, data, params) {
    return Promise.resolve({ id, number: data.number });
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
