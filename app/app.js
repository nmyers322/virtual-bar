import React, { Component } from "react";
import { render } from "react-dom";
import "./styles/styles.css";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import VirtualBar from './VirtualBar';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import './public/favicons';

const store = createStore(reducer);

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

let dom = document.getElementById("virtualbar");
render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <VirtualBar />
        </MuiThemeProvider>
    </Provider>
    ,
    dom
);