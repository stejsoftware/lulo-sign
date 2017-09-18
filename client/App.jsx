import React from "react";
import { connect } from "react-redux";
import Display from "./components/Display";
import Led from "./components/Led";
import {
  Panel,
  ButtonToolbar,
  Button,
  FormControl,
  Well,
  Grid,
  Row,
  Col
} from "react-bootstrap";

const mapStateToProps = state => ({
  reduxState: state
});

const mapDispatchToProps = (dispatch, { services }) => ({
  getCount: () => {
    dispatch(services.count.get(1));
  },
  getLight: () => {
    dispatch(services.light.get(1));
  },
  setCount: count => {
    var number = Number.parseInt(count);
    if (Number.isInteger(number)) {
      dispatch(services.count.update(1, { number }));
      return "";
    }
    return count;
  },
  clearCount: () => {
    dispatch(services.count.update(1, { number: "" }));
  },
  setLightOn: () => {
    dispatch(services.light.update(1, { state: true }));
  },
  setLightOff: () => {
    dispatch(services.light.update(1, { state: false }));
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getLight();
    this.props.getCount();
  }

  render() {
    return (
      <div>
        <Panel header="Light">
          {this.props.reduxState.sign.light &&
            <Led
              color="green"
              on={this.props.reduxState.sign.light.state === "on"}
            />}
          <ButtonToolbar>
            <Button onClick={this.props.setLightOn}>Turn On</Button>
            <Button onClick={this.props.setLightOff}>Turn Off</Button>
          </ButtonToolbar>
        </Panel>
        <Panel header="Policy Count">
          <Well>
            {this.props.reduxState.sign.count &&
              <Display
                value={this.props.reduxState.sign.count.number}
                digitCount={4}
              />}
          </Well>
          <Grid>
            <Row>
              <Col lg={10} md={10} sm={8} xs={8}>
                <FormControl
                  type="tel"
                  style={{ width: "100%" }}
                  size={4}
                  inputRef={ref => {
                    this.input = ref;
                  }}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      this.input.value = this.props.setCount(this.input.value);
                    }
                  }}
                />
              </Col>
              <Col lg={2} md={2} sm={4} xs={4}>
                <ButtonToolbar>
                  <Button
                    onClick={e => {
                      this.input.value = this.props.setCount(this.input.value);
                    }}
                  >
                    Set
                  </Button>
                  <Button onClick={this.props.clearCount}>Clear</Button>
                </ButtonToolbar>
              </Col>
            </Row>
          </Grid>
        </Panel>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
