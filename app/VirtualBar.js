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
import ComponentWrapper from './ComponentWrapper';
import entry from './img/entry.png';
import lobby from './img/lobby.png';

const WrappedComponent = (WrappedComponent, backgroundImage) => (...props) => <ComponentWrapper backgroundImage={backgroundImage}><WrappedComponent {...props} /></ComponentWrapper>;


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
                <Route path="/lobby" component={WrappedComponent(Lobby, lobby)} />
                <Route path="/table/:tableId" component={Table} />
                <Route path="/" component={WrappedComponent(Entry, entry)} />
            </Switch>
        </Router>
    </div>;
  }

export default VirtualBar;