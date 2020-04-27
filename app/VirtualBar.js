import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from './Table';
import Entry from './Entry';
import Lobby from './Lobby';
import { Router, Route, Switch, useLocation } from 'react-router-dom';
import history from './util/history';
import lobby from './img/lobby.png';
import { withTheme } from '@material-ui/core/styles';
import deviceBrowserDetect from './util/deviceBrowserDetect';
import Platform from './Platform';
import PreloadImages from './PreloadImages';

const VirtualBar = (props) =>
  {
    const [anchor, setAnchor] = React.useState(null);
    const menuOpen = Boolean(anchor);
    return <div className="full-size">
        <Router history={history}>
            <AppBar position="fixed" style={{backgroundColor: 'rgb(64, 64, 64, 0.3)'}}>
                <Toolbar>
                    <IconButton 
                      edge="start" 
                      color="inherit" 
                      aria-label="menu" 
                      style={{ marginRight: '2vh'}}
                      onClick={(event) => setAnchor(event.currentTarget)}>
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{flexGrow: '1'}}>
                      Gehenna
                    </Typography>
                </Toolbar>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                  }}
                  open={menuOpen}
                  onClose={(event) => setAnchor(null)}
                >
                  <MenuItem onClick={() => {
                    history.push('/');
                    setAnchor(null);
                  }}>
                    Exit Bar
                  </MenuItem>
                </Menu>
            </AppBar>
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

export default withTheme(VirtualBar);