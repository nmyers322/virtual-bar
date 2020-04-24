import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@material-ui/core';
import * as Cookies from 'js-cookie';
import xss from 'xss';
import history from './util/history';
import gehenna from './img/gehenna.png';

const redirectOnDev = () => {
    if (location.host === "localhost:3000") {
        const qs = new URLSearchParams(window.location.search);
        if (qs.get('redirect')) {
            switch(qs.get('redirect')) {
                case 'lobby':
                   history.push('/lobby');
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
            name: "",
            showCookieCheck: true,
            showIdCheck: false
        }
    }

    componentDidMount() {
        redirectOnDev();

        if(Cookies.get('ac')) {
            this.setState({
                acceptCookies: true,
                name: Cookies.get('id') ? Cookies.get('id') : "",
                showCookieCheck: false,
                showIdCheck: true
            });
        }
    }

    handleCookieCheckboxChange(event) {
        this.setState({acceptCookies: event.target.checked});
    }

    handleEnter() {
        if (this.state.name === "") {
            Cookies.set('ac', true);
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
            Cookies.set('id', this.state.name);
            history.push('/lobby');
        }
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>
                <div style={{
                    maxWidth: '300px',
                    marginTop: '5vh'
                }}>
                    <img src={gehenna} width="100%" height="100%" />
                </div>
                { this.state.showCookieCheck && 
                    <div className="cookie-terms" style={{
                        color: "#FFFFFF",
                        marginTop: "10vh",
                        marginLeft: "10vh",
                        marginRight: "5vh"
                    }}>
                        <Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={this.state.acceptCookies}
                                        onChange={this.handleCookieCheckboxChange}    
                                    />
                                }
                                label="I agree that this app can store local cookies on my device for user-based features."
                            />
                        </Typography>
                    </div>
                }
                { this.state.showIdCheck && 
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
                                value={this.state.name}
                                onChange={(event) => this.setState({name: event.target.value})}
                            />
                        </div>
                    </div>
                }
                <div className="enter-button" style={{
                    textAlign: "center",
                    marginTop: this.state.showCookieCheck ? "10vh" : this.state.showIdCheck ? "8vh" : "56vh"
                }}>
                    <Button 
                        variant="outlined" 
                        color="default" 
                        size="large"
                        disabled={!this.state.acceptCookies || (this.state.showIdCheck && this.state.name === "")}
                        onClick={this.handleEnter}>
                        ENTER
                    </Button>
                </div>
                <div className="enter-button" style={{
                    textAlign: "center",
                    marginTop: "20vh",
                    color: "#FFFFFF",
                    margin: "5vh",
                    backgroundColor: "#000000"
                }}>
                    <Typography>
                        This is a prototype app and so far only works on Safari on iPhone 8+ or greater.
                    </Typography>
                </div>
            </div>
        );
    }
}
