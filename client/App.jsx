import React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";
import Display from "./components/Display";

const mapStateToProps = state => ({
  reduxState: state
});

const mapDispatchToProps = (dispatch, { services }) => ({
  getCount: () => {
    dispatch(services.count.get(1));
  }
});

const Number = ({ data, label }) =>
  <pre>
    {data && <Display value={data.number} digitCount={4} />}
  </pre>;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.props.getCount();
    this.state = { number: 0 };

    setInterval(() => {
      this.setState({ number: this.state.number + 1 });
    }, 1000);
  }

  render() {
    return (
      <div>
        <Panel header="Number">
          <Number data={this.props.reduxState.count.data} />
        </Panel>
        <Panel header="Counter">
          <Display value={this.state.number} digitCount={4} color="green" />
        </Panel>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
