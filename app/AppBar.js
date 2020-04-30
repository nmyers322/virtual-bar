import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LocalBar from '@material-ui/icons/LocalBar';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Drawer from '@material-ui/core/Drawer';
import Drink from './Drink';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { drinks } from './util/drinks';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import { tableNumberFromPath } from './util/tables';
import { withRouter } from 'react-router-dom';

const VirtualBarAppBar = ({currentDrink, history, setCurrentDrink}) => {
  console.log("Visited new path", history && history.location);
  const [anchor, setAnchor] = React.useState(null);
  return <div>
    <AppBar position="fixed" style={{backgroundColor: 'rgb(64, 64, 64, 0.3)'}}>
        <Toolbar>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              style={{ marginRight: '2vh'}}
              onClick={(event) => setAnchor('left')}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{flexGrow: '1'}}>
              Gehenna
            </Typography>
            { (history && history.location && history.location.pathname && history.location.pathname.includes('table')) &&
              <Typography>
                Table { tableNumberFromPath(history.location.pathname) }
              </Typography>
            }
        </Toolbar>
        <Drawer open={anchor === 'left'} anchor={'left'} onClose={() => setAnchor(null)}>
          <div role="presentation" onClick={() => setAnchor(null)} onKeyDown={() => setAnchor(null)}>
            <List>
              <ListItem key={'order-drink'}>
                <ListItemText primary="Order Drink" />
              </ListItem>
              <Divider />
              { Object.keys(drinks).map(drink => 
                <ListItem 
                  key={drink} 
                  button 
                  disabled={!!currentDrink || (history && history.location && history.location.pathname === '/')}
                  onClick={() => !currentDrink && setCurrentDrink(drinks[drink])}>
                  <ListItemIcon><LocalBar /></ListItemIcon>
                  <ListItemText primary={drinks[drink].name} />
                </ListItem>) 
              }
              <Divider />
              <ListItem key={'drinks-by'}>
                <ListItemText>
                  Drink drawings by <Link href="https://trashmaiden.bigcartel.com/">Trash Maiden</Link>
                </ListItemText>
              </ListItem>
              <Divider />
              <ListItem key={'code-by'}>
                <ListItemText>
                  Code by <Link href="https://nate.technology">Nathanial Myers</Link>
                </ListItemText>
              </ListItem>
              { history.location.pathname !== '/' && <Divider /> }
              { history.location.pathname !== '/' &&
                <ListItem onClick={() => history.push('/')}>
                  <ListItemText primary="Exit Bar" />
                </ListItem>
              }
            </List>
          </div>
        </Drawer>
    </AppBar>
    <Drink drink={currentDrink} />
  </div>;
}

const mapStateToProps = state => ({
  currentDrink: state.currentDrink
});

const mapDispatchToProps = dispatch => ({
  setCurrentDrink: (drink) => dispatch({type: "SET_DRINK", payload: {currentDrink: drink} })
});

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(withRouter(VirtualBarAppBar)));