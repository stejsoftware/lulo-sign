import React from "react";
import cc from "color-convert";

const Color = ({ color, children }) =>
  <div
    style={{
      backgroundColor: `rgb(${color})`,
      color: "white"
    }}
  >
    {children}
  </div>;

class Led extends React.Component {
  constructor(props) {
    super(props);
  }

  hsl() {
    return cc.keyword.hsl(this.props.color).map((v, i) => {
      return i == 2 ? (this.props.on ? v + v * 0.5 : v - v * 0.5) : v;
    });
  }

  color() {
    return `#${cc.rgb.hex(cc.hsl.rgb(this.hsl()))}`;
  }

  dark() {
    return `#${cc.rgb.hex(
      cc.hsl.rgb(
        this.hsl().map((v, i) => {
          return i == 2 ? v - v * 0.1 : v;
        })
      )
    )}`;
  }

  hightlight() {
    return `#${cc.rgb.hex(
      cc.hsl.rgb(
        this.hsl().map((v, i) => {
          return i == 2 ? v + v * 0.1 : v;
        })
      )
    )}`;
  }

  render() {
    return (
      <div style={{ width: this.props.width, height: this.props.height }}>
        <svg viewBox="0 0 640 480">
          <defs>
            <linearGradient
              id={`svg_${this.props.color}_6`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop stopColor="#bfbfbf" offset="0" />
              <stop stopColor="#404040" offset="1" />
            </linearGradient>
            <linearGradient
              id={`svg_${this.props.color}_11`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
              spreadMethod="pad"
            >
              <stop
                stopColor={this.color()}
                stopOpacity="0.992188"
                offset="0"
              />
              <stop stopColor={this.dark()} stopOpacity="0.988281" offset="1" />
            </linearGradient>
            <linearGradient
              id={`svg_${this.props.color}_14`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
              spreadMethod="pad"
            >
              <stop stopColor="#ffffff" stopOpacity="0.996094" offset="0" />
              <stop
                stopColor={this.hightlight()}
                stopOpacity="0.984375"
                offset="0.703125"
              />
            </linearGradient>
          </defs>
          <g>
            <title>Layer 1</title>
            <circle
              fill="#212121"
              strokeWidth="17.5"
              strokeLinecap="round"
              cx="320"
              cy="240"
              r="196.125"
              id="svg_3"
              transform="rotate(90 320 240)"
            />
            <circle
              fill={`url(#svg_${this.props.color}_6)`}
              strokeWidth="17.5"
              strokeLinecap="round"
              fillOpacity="0.64"
              cx="319.252837"
              cy="239.999045"
              r="160"
              id="svg_7"
            />
            <circle
              fill={`url(#svg_${this.props.color}_11)`}
              strokeWidth="17.5"
              strokeLinecap="round"
              cx="320.000535"
              cy="240.001698"
              r="150"
              id="svg_8"
            />
            <ellipse
              fill={`url(#svg_${this.props.color}_14)`}
              strokeWidth="17.5"
              strokeLinecap="round"
              cx="249.179609"
              cy="168.124194"
              rx="75.675959"
              ry="44.402987"
              id="svg_20"
              transform="rotate(-47.7626 249.18 168.124)"
            />
          </g>
        </svg>
      </div>
    );
  }
}

Led.defaultProps = {
  width: 100,
  height: 100,
  color: "blue",
  on: false
};

export default Led;
