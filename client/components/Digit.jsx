import React from "react";
import { Panel } from "react-bootstrap";

class Digit extends React.Component {
  constructor(props) {
    super(props);

    this.segments = {
      a: [[1, 1], [2, 0], [8, 0], [9, 1], [8, 2], [2, 2]],
      b: [[9, 1], [10, 2], [10, 8], [9, 9], [8, 8], [8, 2]],
      c: [[9, 9], [10, 10], [10, 16], [9, 17], [8, 16], [8, 10]],
      d: [[9, 17], [8, 18], [2, 18], [1, 17], [2, 16], [8, 16]],
      e: [[1, 17], [0, 16], [0, 10], [1, 9], [2, 10], [2, 16]],
      f: [[1, 9], [0, 8], [0, 2], [1, 1], [2, 2], [2, 8]],
      g: [[1, 9], [2, 8], [8, 8], [9, 9], [8, 10], [2, 10]]
    };

    this.digits = {
      "0": ["a", "b", "c", "d", "e", "f"],
      "1": ["b", "c"],
      "2": ["a", "b", "g", "e", "d"],
      "3": ["a", "b", "g", "c", "d"],
      "4": ["f", "g", "b", "c"],
      "5": ["a", "f", "g", "c", "d"],
      "6": ["a", "f", "g", "c", "d", "e"],
      "7": ["a", "b", "c"],
      "8": ["a", "b", "c", "d", "e", "f", "g"],
      "9": ["a", "b", "c", "d", "f", "g"]
    };
  }

  render() {
    return (
      <svg>
        <g
          transform={`scale(${this.props.scale})`}
          style={{
            fillRule: "evenodd",
            stroke: "#fff",
            strokeWidth: 0.25,
            strokeOpacity: 1,
            strokeLinecap: "butt",
            strokeLinejoin: "miter"
          }}
        >
          {Object.keys(this.segments).map(key =>
            <polygon
              key={key}
              points={this.segments[key]}
              fill="red"
              fillOpacity={
                this.digits[this.props.value].indexOf(key) < 0
                  ? this.props.offOpacity
                  : this.props.onOpacity
              }
            />
          )}
        </g>
      </svg>
    );
  }
}

Digit.defaultProps = {
  scale: 5,
  value: 0,
  onOpacity: 1,
  offOpacity: 0.25,
  color: "red"
};

export default Digit;
