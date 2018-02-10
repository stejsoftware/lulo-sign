/* eslint-disable no-unused-vars */
const SerialPort = require("serialport");
const _ = require("lodash");

const cmd = {
  kAcknowledge: 0,
  kError: 1,
  kSetCount: 2,
  kClear: 3,
  kTest: 4
};

const HIGH = 1;
const LOW = 0;

class Service {
  constructor(options) {
    this.options = options || {};

    this.docs = {
      description: "A service to set/get the number displayed on the sign.",
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
          example: { number: 1234 }
        }
      }
    };

    this.port = new SerialPort(options.serial.comport, {
      baudRate: options.serial.baudrate
    });

    this.port.on("error", function(err) {
      console.log("Error: ", err.message);
    });

    this.port.on("open", function() {
      console.log("serial port opened:", options.serial);
    });

    this.port.on("data", data => {
      console.log("From Arduino:", data.toString());
    });

    //GPIO declarations
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    this.digitCount = this.options.digitCount || 4;
    this.state = {};
  }

  get(id, params) {
    return Promise.resolve({
      id,
      number: this.state[id] || -1
    });
  }

  update(id, data, params) {
    this.state[id] = data.number;

    var digits = data.number
      .toString()
      .padStart(this.digitCount)
      .substr(-this.digitCount);

    console.log({ digits });

    this.port.write(`${cmd.kSetCount},${digits};`);

    return Promise.resolve({
      id,
      number: this.state[id]
    });
  }

  remove(id, params) {
    this.state[id] = null;
    this.port.write(`${cmd.kClear};`);

    return Promise.resolve({
      id,
      number: this.state[id]
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    data.text = `${data.cmd},${data.args.join(",")};`;

    console.log({ data });

    this.port.write(data.text);

    return Promise.resolve(data);
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
