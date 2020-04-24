import React, { Component } from 'react';
import PropTypes from 'prop-types';
import table_icon from './img/table_icon.png';
import { Button, Typography } from '@material-ui/core';
import * as Cookies from 'js-cookie';
import xss from 'xss';
import history from './util/history';


export default class Lobby extends Component {
    constructor(props) {
        super(props);

        this.tables= [
            "3674c165-df23-45ce-b6a7-2ca86bc83436",
            "841f1d2c-2d91-40bd-804e-4ab5798bf2bb",
            "007b482e-9010-4fad-9fc1-c23726fc7ff0",
            "0c7846ba-78b0-4556-9b38-d90008291f2c"
        ];
    }

    componentDidMount() {
        if(!Cookies.get('ac') && !Cookies.get('id')) {
            histoy.push('/');
        }
    }

    render() {
        return (
            <div>
                <div style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '5vh',
                    marginBottom: '10vh',
                    width: '100%'
                }}>
                    <Button
                        variant='outlined'
                        size='large'
                        color='default'
                        onClick={() => history.push('/')}>
                        Exit Bar
                    </Button>
                </div>
                { this.tables.map((tableId, index) => <TableIcon tableId={tableId} key={tableId} number={index + 1} />) }
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
            <div className="table-icon" style={{
                width: '10vh',
                height: '10vh',
                backgroundColor: 'rgb(125, 125, 125, 0.7)',
                border: 'solid 1px #EEEEEE',
                padding: '15px',
                paddingTop: '40px',
                paddingBottom: '40px',
                borderRadius: '15px',
                textAlign: 'center',
                margin: '2vh',
                cursor: 'pointer',
                display: 'inline-block'
            }}
            onClick={this.handleClick}>
                <Typography>
                    Table { this.props.number }
                </Typography>
                <img src={table_icon} width="80%" height="80%" />
            </div>
        );
    }
}