import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, Grid, Link, TextField, Typography } from '@material-ui/core';
import * as Cookies from 'js-cookie';
import xss from 'xss';
import history from './util/history';
import gehenna from './img/gehenna.png';
import deviceBrowserDetect from './util/deviceBrowserDetect';
import entry from './img/entry.png';

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

export default class Entry extends Component {
    constructor(props) {
        super();

        this.handleCookieCheckboxChange = this.handleCookieCheckboxChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);

        this.state = {
            acceptCookies: false,
            actionInProgress: false,
            deviceBrowserAllowed: true,
            getUserMediaSupported: true,
            name: "",
            showCookieCheck: true,
            showIdCheck: false
        }
    }

    componentDidMount() {
        redirectOnDev();

        let newState = {};

        if(Cookies.get('ac')) {
            newState = {
                acceptCookies: true,
                name: Cookies.get('id') ? Cookies.get('id') : "",
                showCookieCheck: false,
                showIdCheck: true
            };
        }

        if(deviceBrowserDetect.isIOS() && !deviceBrowserDetect.isSafari()) {
            newState.deviceBrowserAllowed = false;
        }

        if(Object.keys(newState).length > 0) {
            this.setState(newState);
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
                    backgroundPosition: 'center 0px'
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
                        <CompatibilityInstructions /> 
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
                                backgroundColor: '#222222',
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
                                    onKeyUp={(event) => event.key === 'Enter' && this.handleEnter(event)}
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
                                onClick={this.handleEnter}>
                                { !actionInProgress && <div>ENTER</div> }
                                { actionInProgress && <div className="mini-loader" /> }
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

class CompatibilityInstructions extends Component {
    render() {
        return <Grid item xs={10} sm={9} lg={6} style={{marginTop: '5vh'}}>
            { deviceBrowserDetect.isIOS() &&
                <Typography color="textPrimary">
                    Welcome to the virtual bar video chat app. 
                    It looks like you are on a device running 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.apple.com/ios/ios-13/" target="new">iOS</Link> 
                    but you are not using 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.apple.com/safari/" target="new">Safari</Link>. 
                    You must use Safari to access the camera and microphone. Open the Safari app from your home screen.
                </Typography>
            }
            { !deviceBrowserDetect.isIOS() &&
                <Typography color="textPrimary">
                    Welcome to the virtual bar video chat app. 
                    It looks like you are using a browser that does not support video and audio chat. 
                    It's highly suggested that you use 
                    <Link color="secondary" style={{marginLeft: '1vh', marginRight: '1vh'}} href="https://www.google.com/chrome/" target="new">Chrome</Link>.
                </Typography>
            }
        </Grid>;
    }
}