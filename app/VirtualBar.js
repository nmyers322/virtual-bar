import React from "react";
import AppBar from './AppBar';
import Table from './Table';
import Entry from './Entry';
import Lobby from './Lobby';
import DrunkFilter from './DrunkFilter';
import { Router, Route, Switch, useLocation } from 'react-router-dom';
import history from './util/history';
import { withTheme } from '@material-ui/core/styles';
import Platform from './Platform';
import PreloadImages from './PreloadImages';
import { connect } from 'react-redux';
import LiveStream from "./LiveStream";

const VirtualBar = ({}) => {
  return <div className="full-size">
      <Router history={history}>
          <LiveStream />
          <AppBar />
          <DrunkFilter />
          <Switch>
              <Route path="/lobby" component={withTheme(Lobby)} />
              <Route path="/platform" component={withTheme(Platform)} />
              <Route path="/table/:tableId" component={withTheme(Table)} />
              <Route path="/" component={withTheme(Entry)} />
          </Switch>
          <PreloadImages />
      </Router>
  </div>;
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(VirtualBar));