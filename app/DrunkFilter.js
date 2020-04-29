import React from "react";
import { connect } from 'react-redux';
import drunk_space from './img/drunk-space.gif';

const calculateDrunkStyle = (drunkness) => {
  switch (drunkness) {
    case 'not-drunk':
      return {}
    case 'drunk':
      return {
        backgroundImage: 'url(' + drunk_space + ')',
        backgroundPosition: 'center 0px',
        backgroundSize: 'cover',
        opacity: '0.1',
        filter: 'blur(1px)',
        transition: 'all 1s ease'
      }
    case 'really-drunk':
      return {
        backgroundImage: 'url(' + drunk_space + ')',
        backgroundPosition: 'center 0px',
        backgroundSize: 'cover',
        opacity: '0.3',
        filter: 'blur(3px)',
        transition: 'all 1s ease'
      }
    case 'super-drunk':
      return {
        backgroundImage: 'url(' + drunk_space + ')',
        backgroundPosition: 'center 0px',
        backgroundSize: 'cover',
        opacity: '0.5',
        filter: 'blur(5px)',
        transition: 'all 1s ease'
      }
    case 'wasted':
      return {
        backgroundImage: 'url(' + drunk_space + ')',
        backgroundPosition: 'center 0px',
        backgroundSize: 'cover',
        opacity: '0.7',
        filter: 'blur(10px)',
        transition: 'all 1s ease'
      }
  }
}

const handleClick = (event) => {
  return true;
}

const DrunkFilter = ({drunkness, decreaseDrunkness}) => {
  if (drunkness !== 'not-drunk') {
    console.log("User got " + drunkness);
    setTimeout(() => decreaseDrunkness(), 30000);
  }
  return <div className={"drunk-filter"} style={calculateDrunkStyle(drunkness)} onClick={handleClick}>
  </div>;
}

const mapStateToProps = state => ({
  drunkness: state.drunkness
});

const mapDispatchToProps = dispatch => ({
  decreaseDrunkness: () => dispatch({type: "DECREASE_DRUNKNESS"})
});

export default connect(mapStateToProps, mapDispatchToProps)(DrunkFilter);
