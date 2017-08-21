import React from "react";
import { connect } from "react-redux";
import { Panel } from "react-bootstrap";

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
    <span>
      {label || "Number"}:&nbsp;
    </span>
    {data && JSON.stringify(data.number, null, 2)}
  </pre>;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props.getCount();
  }

  render() {
    return (
      <Panel header="Number">
        <Number label="Count" data={this.props.reduxState.count.data} />
      </Panel>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);