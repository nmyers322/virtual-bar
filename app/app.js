import React, { Component } from "react";
import { render } from "react-dom";
import "./styles/styles.css";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import VirtualBar from './VirtualBar';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

let dom = document.getElementById("app");
render(
    <MuiThemeProvider theme={theme}>
        <VirtualBar />
    </MuiThemeProvider>
    ,
    dom
);