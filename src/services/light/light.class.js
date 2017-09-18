/* eslint-disable no-unused-vars */

const GPIO = require("onoff").Gpio;
const _ = require("lodash");

class Service {
  constructor(options) {
    this.options = options || {};

    this.docs = {
      description: "A service to control the state of the light.",      
      definitions: {
        light: {
          type: "object",
          properties: {
            state: {
              type: "string",
              enum: ["on", "off"],
              description: "the state of the light"
            }
          },
          required: ["state"],
          example: { state: "on" }
        }
      }
    };

    this.pins = [new GPIO(this.options.pin || 18, "out")];
  }

  getPin(id) {
    if (id > 0 && id <= this.pins.length) {
      return this.pins[id - 1];
    } else {
      throw new Error(`Unknown id: ${id}`);
    }
  }

  readPin(id) {
    return this.getPin(id).readSync() == 1 ? "on" : "off";
  }

  writePin(id, state) {
    var isOn = _.includes(
      ["on", "1", "yes", "true"],
      state.toString().toLowerCase()
    );

    var isOff = _.includes(
      ["off", "0", "no", "false"],
      state.toString().toLowerCase()
    );

    if (isOn && !isOff) {
      this.getPin(id).writeSync(1);
    } else if (isOff && !isOn) {
      this.getPin(id).writeSync(0);
    } else {
      throw new Error(`Invalid state value: ${state}`);
    }
  }

  get(id, params) {
    return Promise.resolve({
      id,
      state: this.readPin(id)
    });
  }

  update(id, data, params) {
    this.writePin(id, data.state);

    return Promise.resolve({
      id,
      state: this.readPin(id)
    });
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
