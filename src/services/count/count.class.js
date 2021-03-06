/* eslint-disable no-unused-vars */
const SerialPort = require("serialport");
const _ = require("lodash");
const myIP = require("my-ip");

const cmd = {
  kAcknowledge: 0,
  kError: 1,
  kSetCount: 2,
  kSetElement: 3,
  kClear: 4
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

    this.showIp = 0;
    this.ip = [...myIP().split("."), ""];

    console.log({ ip: this.ip });

    this.showIpTimer = setInterval(this.displayIp.bind(this), 1750);
  }

  displayIp() {
    if (this.ip[this.showIp].length > 0) {
      this.port.write(`${cmd.kSetCount},${this.ip[this.showIp]};`);
    } else {
      this.port.write(`${cmd.kClear};`);
    }

    this.showIp = (this.showIp + 1) % this.ip.length;
  }

  get(id, params) {
    clearInterval(this.showIpTimer);

    return Promise.resolve({
      id,
      number: this.state[id] || -1
    });
  }

  update(id, { number }, params) {
    clearInterval(this.showIpTimer);

    console.log({ number });

    if (typeof number == "string") {
      if (number.length > 0) {
        number = Number(number).valueOf();
      } else {
        number = null;
      }
    }

    var text = "";

    if (number != null) {
      text = `${cmd.kSetCount},${number};`;
      console.log("set:", text);
    } else {
      text = `${cmd.kClear};`;
      console.log("clear:", text);
    }

    this.state[id] = number;
    this.port.write(text);

    return Promise.resolve({
      id,
      number: this.state[id]
    });
  }

  remove(id, params) {
    clearInterval(this.showIpTimer);

    this.state[id] = null;
    this.port.write(`${cmd.kClear};`);

    return Promise.resolve({
      id,
      number: this.state[id]
    });
  }

  create(data, params) {
    clearInterval(this.showIpTimer);

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
