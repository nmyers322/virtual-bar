import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import * as Cookies from 'js-cookie';
import xss from 'xss';
import history from './util/history';
import lobby from './img/lobby.png';
import table_icon from './img/table_icon.png';
import exit_door from './img/exit_door.png';

const iconStyles = {
    width: '10vh',
    height: '10vh',
    backgroundColor: 'rgb(25, 25, 25, 0.8)',
    border: 'solid 1px #EEEEEE',
    padding: '10px',
    paddingTop: '20px',
    paddingBottom: '20px',
    borderRadius: '15px',
    textAlign: 'center',
    margin: '2vh',
    cursor: 'pointer',
    display: 'inline-block'
};

export default class Lobby extends Component {
    constructor(props) {
        super(props);

        this.tables= [
            '3674c165-df23-45ce-b6a7-2ca86bc83436',
            '841f1d2c-2d91-40bd-804e-4ab5798bf2bb',
            '007b482e-9010-4fad-9fc1-c23726fc7ff0',
            '0c7846ba-78b0-4556-9b38-d90008291f2c',
            'd81f1f4b-536e-4282-8f79-d029fda22420',
            '16b416f9-c77d-4dfb-81b1-cc3c998425ac',
            '4e461feb-d1d2-4e88-a629-55cfa3216780',
            'b44067f3-f528-4a3c-9e29-74112daa673c',
            'ed2fadce-c89e-48da-bfb6-6d4eb918ebca',
            '7aac339a-e763-47f5-be1e-231b2a099899',
            'fb2e8b33-a755-402c-809c-5aaab9c1111a',
            '6a6ae0e3-1e29-4207-9c70-b8820f67bc48',
            'a5937f71-91e2-4db7-804a-20cceb33e7e2',
            '80979eab-5ab9-4d9a-a5d1-bde6426c0c7b',
            'a4148288-844c-4919-bf40-2ef7bf3ac054',
            '0e57cd22-c5a0-452e-801e-bf98082565f2',
            '790c4dc6-1d02-48cc-bf1c-a3c986beb464',
            'c763f295-d2b1-418e-a855-3aaf57b109a1',
            '65f5b1d5-2e48-46db-a8a6-8ed22d70fc8d',
            '10b9e154-37f7-4c2a-8985-88cb049a9f09'
        ];
    }

    componentDidMount() {
        if(!Cookies.get('ac') && !Cookies.get('id')) {
            histoy.push('/');
        }
    }

    render() {
        return (
            <div className="component-wrapper">
                <div className="component-background-image" style={{
                    backgroundImage: 'url(' + lobby + ')',
                    backgroundColor: '#181818',
                    backgroundPosition: 'center 0px'
                    }} />
                <div className="lobby-icons">
                    <ExitIcon />
                    { this.tables.map((tableId, index) => <TableIcon tableId={tableId} key={tableId} number={index + 1} />) }
                </div>
            </div>
        );
    }
}

class TableIcon extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        history.push('/table/' + this.props.tableId);
    }

    render() {
        return (
            <div className="table-icon" style={iconStyles}
            onClick={this.handleClick}>
                <Typography color="textPrimary">
                    Table { this.props.number }
                </Typography>
                <img src={table_icon} width="80%" height="80%" />
            </div>
        );
    }
}

class ExitIcon extends Component {
    render() {
        return <div style={iconStyles} onClick={() => history.push('/')}>
            <Typography color="textPrimary">
                Exit Bar
                </Typography>
                <img src={exit_door} height="80%" />
        </div>
    }
}