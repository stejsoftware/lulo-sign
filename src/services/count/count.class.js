/* eslint-disable no-unused-vars */
const SerialPort = require("serialport");
const _ = require("lodash");

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

    this.port = new SerialPort('/dev/serial0', {
      baudRate: 9600
    });
    
    this.port.on('error', function(err) {
      console.log('Error: ', err.message);
    })
    
    this.port.on('open', function() {
      console.log("open");
    });
    
    this.port.on('data', (data) => {
         console.log('From Arduino:',data.toString());
       });
      
    //GPIO declarations
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    this.digitCount = this.options.digitCount || 4;
    this.state = {};
  }

  get(id, params) {
    return Promise.resolve({
      id,
      number: this.state[id] || 0
    });
  }

  update(id, data, params) {
    this.state[id] = data.number;

    this.showNumber(data.number);

    return Promise.resolve({
      id,
      number: this.state[id]
    });
  }

  //Takes a number and displays 2 numbers. Displays absolute value (no negatives)
  showNumber(number) {
    var digits = number.toString().padStart(this.digitCount).substr(-this.digitCount);

    console.log({ digits });

    this.port.write(`2,${digits};`);
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
