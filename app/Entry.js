import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Link, TextField, Typography } from '@material-ui/core';
import * as Cookies from 'js-cookie';
import xss from 'xss';
import history from './util/history';
import gehenna from './img/gehenna.png';
import deviceBrowserDetect from './util/deviceBrowserDetect';
import entry from './img/entry.png';
import outside_bar from './img/outside_bar.png';
import CompatibilityInstructions from './CompatibilityInstructions';
import { connect } from 'react-redux';

const redirectOnDev = () => {
    if (location.host === "localhost:3000") {
        const qs = new URLSearchParams(window.location.search);
        if (qs.get('redirect')) {
            switch(qs.get('redirect')) {
                case 'lobby':
                   history.push('/lobby');
                   break;
                case 'platform':
                    history.push('/platform');
                    break;
                case 'table':
                    history.push('/table/' + qs.get('tableId'));
                    break;
            }
        }
    }
}

class Entry extends Component {
    constructor(props) {
        super();

        this.handleCookieCheckboxChange = this.handleCookieCheckboxChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);

        this.state = {
            acceptCookies: false,
            actionInProgress: false,
            deviceBrowserAllowed: true,
            deviceBrowserError: null,
            getUserMediaSupported: true,
            name: "",
            showCookieCheck: true,
            showIdCheck: false
        }
    }

    componentDidMount() {
        redirectOnDev();

        let newState = {};

        if (Cookies.get('ac')) {
            newState = {
                acceptCookies: true,
                name: Cookies.get('id') ? Cookies.get('id') : "",
                showCookieCheck: false,
                showIdCheck: true
            };
        }

        if (deviceBrowserDetect.isIOS() && !deviceBrowserDetect.isSafari()) {
            newState.deviceBrowserAllowed = false;
        }

        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }

        if (this.props.currentDrink) {
            this.props.emptyDrink();
        }

    }

    handleCookieCheckboxChange(event) {
        this.setState({acceptCookies: event.target.checked});
    }

    handleEnter() {
        if (this.state.name === "") {
            Cookies.set('ac', true, { expires: 9999999999 });
            let name = "";
            if (Cookies.get('id')) {
                name = Cookies.get('id');
            }
            this.setState({
                name,
                showCookieCheck: false,
                showIdCheck: true
            });
        } else {
            this.setState({
                actionInProgress: true
            }, () => {
                deviceBrowserDetect.checkGetUserMediaExists()
                    .then(exists => {
                        Cookies.set('id', this.state.name, { expires: 9999999999 });
                        history.push('/lobby');
                    })
                    .catch(error => {
                        this.setState({
                            actionInProgress: false,
                            deviceBrowserError: error,
                            getUserMediaSupported: false
                        });
                    });
            });
                
        }
    }

    render() {
        let {
            acceptCookies,
            actionInProgress,
            deviceBrowserAllowed,
            deviceBrowserError,
            getUserMediaSupported,
            name,
            showCookieCheck,
            showIdCheck
        } = this.state;
        return (
            <div className="component-wrapper">
                <div className="component-background-image" style={{
                    backgroundImage: 'url(' + entry + ')',
                    backgroundColor: '#181818',
                    backgroundPosition: 'center 0px',
                    zIndex: '-2'
                    }} />
                <img src={outside_bar} style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    textAlign: 'center',
                    maxWidth: '90%',
                    zIndex: '-1'
                }} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'top',
                    alignItems: 'center',
                    height: "100%"
                    }}>
                    <div style={{
                        maxWidth: '180px',
                        marginTop: '2vh'
                        }}>
                        <img src={gehenna} width="100%" height="100%" />
                    </div>
                    { (!deviceBrowserAllowed || !getUserMediaSupported) &&
                        <CompatibilityInstructions err={deviceBrowserError} /> 
                    }
                    { deviceBrowserAllowed && getUserMediaSupported && showCookieCheck && 
                        <div className="cookie-terms" style={{
                            color: "#FFFFFF",
                            marginTop: "5vh",
                            marginLeft: "10vh",
                            marginRight: "5vh"
                            }}>
                            <Typography style={{fontSize: '12pt'}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                            checked={acceptCookies}
                                            onChange={this.handleCookieCheckboxChange}    
                                        />
                                    }
                                    label="I agree that this app can store local cookies on my device for user-based features."
                                />
                            </Typography>
                        </div>
                    }
                    { deviceBrowserAllowed && getUserMediaSupported && showIdCheck && 
                        <div className="id-check" style={{
                            color: "#FFFFFF",
                            marginTop: "10vh",
                            marginLeft: "auto",
                            marginRight: "auto",
                            maxWidth: '220px',
                            textAlign: 'center'
                            }}>
                            <Typography style={{ marginBottom: '15px' }}>
                                ID, please.
                            </Typography>
                            <div style={{
                                width: '85%',
                                height: '25%',
                                backgroundColor: 'rgb(25, 25, 25, 0.6)',
                                border: 'solid 1px #EEEEEE',
                                padding: '20px',
                                paddingTop: '40px',
                                paddingBottom: '40px',
                                borderRadius: '15px'
                                }}>
                                <TextField 
                                    id="name" 
                                    label="Your Name"
                                    value={name}
                                    onChange={(event) => this.setState({name: event.target.value})}
                                    onKeyUp={(event) => event.key === 'Enter' && !actionInProgress && this.handleEnter(event)}
                                />
                            </div>
                        </div>
                    }
                    { deviceBrowserAllowed && getUserMediaSupported &&
                        <div className="enter-button" style={{
                            textAlign: "center",
                            marginTop: showCookieCheck ? "5vh" : showIdCheck ? "2vh" : "56vh"
                            }}>
                            <Button 
                                variant="outlined" 
                                color="default" 
                                size="large"
                                disabled={!acceptCookies || (showIdCheck && name === "") || !deviceBrowserAllowed || !getUserMediaSupported || actionInProgress}
                                onClick={this.handleEnter}
                                style={{backgroundColor: 'rgb(25, 25, 25, 0.6)'}}>
                                { !actionInProgress && <div>ENTER</div> }
                                { actionInProgress && <div className="loader" /> }
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentDrink: state.currentDrink
});

const mapDispatchToProps = dispatch => ({
    emptyDrink: () => dispatch({type:'SET_DRINK', payload: {currentDrink: null}})
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);