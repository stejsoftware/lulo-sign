/* eslint-disable no-unused-vars */

const GPIO = require("onoff").Gpio;
const _ = require("lodash");

const HIGH = 1;
const LOW = 0;

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

    //GPIO declarations
    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    this.segmentLatch = new GPIO(this.options.LAT || 25, "out");
    this.segmentClock = new GPIO(this.options.CLK || 24, "out");
    this.segmentData = new GPIO(this.options.SER || 4, "out");
    this.digitCount = this.options.digitCount || 4;
    this.state = {};

    const segs = ["a", "b", "c", "d", "e", "g", "p", " "];

    const test = (x, y) => {
      if (y < this.digitCount) {
        const test2 = z => {
          if (z < segs.length) {
            this.showNumber(segs[z].padEnd(y + 1, " "));
            setTimeout(test2, 200, z + 1);
          } else {
            setTimeout(test, 0, x, y + 1);
          }
        };
        test2(x);
      }
    };
    test(0, 0);
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
    var digits = number.toString().padStart(this.digitCount);

    console.log({ digits });

    digits.split("").reverse().map(ch => {
      this.postNumber(ch, false);
    });

    //Latch the current segment data
    this.segmentLatch.writeSync(LOW);
    this.segmentLatch.writeSync(HIGH); //Register moves storage register on the rising edge of RCK
  }

  // Given a number, or '-', shifts it out to the display
  postNumber(number, decimal) {
    // segment layout
    //-----------+-----------
    //     -     |    A
    //   /   /   |  F   B
    //     -     |    G
    //   /   /   |  E   C
    //     -  .  |    D  DP
    //-----------+-----------

    var a = 1 << 0;
    var b = 1 << 6;
    var c = 1 << 5;
    var d = 1 << 4;
    var e = 1 << 3;
    var f = 1 << 1;
    var g = 1 << 2;
    var dp = 1 << 7;

    var segments;

    switch (number) {
      case "1":
        segments = b | c;
        break;
      case "2":
        segments = a | b | d | e | g;
        break;
      case "3":
        segments = a | b | c | d | g;
        break;
      case "4":
        segments = f | g | b | c;
        break;
      case "5":
        segments = a | f | g | c | d;
        break;
      case "6":
        segments = a | f | g | e | c | d;
        break;
      case "7":
        segments = a | b | c;
        break;
      case "8":
        segments = a | b | c | d | e | f | g;
        break;
      case "9":
        segments = a | b | c | d | f | g;
        break;
      case "0":
        segments = a | b | c | d | e | f;
        break;
      case "a":
        segments = a;
        break;
      case "b":
        segments = b;
        break;
      case "c":
        segments = c;
        break;
      case "d":
        segments = d;
        break;
      case "e":
        segments = e;
        break;
      case "f":
        segments = f;
        break;
      case "g":
        segments = g;
        break;
      case "p":
        segments = dp;
        break;
      case " ":
      default:
        segments = 0;
        break;
    }

    if (decimal) segments |= dp;

    var bits = segments.toString(2);

    while (bits.length < 8) {
      bits = "0" + bits;
    }

    bits.split("").forEach(bit => {
      // Clock these bits out to the drivers
      this.segmentClock.writeSync(LOW);
      this.segmentData.writeSync(Number(bit));
      this.segmentClock.writeSync(HIGH); // Data transfers to the register on the rising edge of SRCK
    });
  }
}

module.exports = function(options) {
  return new Service(options);
};

module.exports.Service = Service;
