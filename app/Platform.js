import React from "react";
import deviceBrowserDetect from './util/deviceBrowserDetect';

class Platform extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      getUserMediaResult: ''
    }
  }

  componentDidMount() {
    deviceBrowserDetect.checkGetUserMediaExists()
      .then(exists => this.setState({getUserMediaResult: 'getUserMedia exists'}))
      .catch(err => this.setState({getUserMediaResult: err.toString()}));
  }
  
  render() {
    let { disabled } = this.props;
    let styles = disabled
      ? { display: 'none' }
      : { marginTop: '10vh' };
    return <div style={styles}>
      <div>{ deviceBrowserDetect.getPlatform() }</div>
      <div>{ this.state.getUserMediaResult }</div>
    </div>;
  }
}

export default Platform