import React from 'react';
import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import * as Cookies from 'js-cookie';
import history from './util/history';
import lobby from './img/lobby.png';
import exit_door from './img/exit_door.png';
import { connect } from 'react-redux';
import { tableIds } from './util/tables';
import { iconStyles } from './styles/iconStyles';
import { fetchActiveTablesAction } from './actions/lobbyActions';
import TableIcon from './TableIcon';

const Lobby = ({actionInProgress, activeTables, fetchActiveTables}) => {

    const [firstMount, setFirstMount] = useState(true);

    if (!Cookies.get('ac') && !Cookies.get('id')) {
        histoy.push('/');
    }

    if (firstMount && !actionInProgress) {
        fetchActiveTables();
        setFirstMount(false);
    }

    return (
        <div className="component-wrapper">
            <div className="component-background-image" style={{
                backgroundImage: 'url(' + lobby + ')',
                backgroundColor: '#181818',
                backgroundPosition: 'center 0px'
                }} />
            <div className="lobby-icons">
                <ExitIcon />
                { 
                    tableIds.map((tableId, index) => 
                        <TableIcon 
                            tableId={tableId} 
                            key={tableId} 
                            number={index + 1} 
                            room={activeTables && activeTables.rooms && activeTables.rooms[tableId]}
                        />) 
                }
            </div>
        </div>
    );
    
}

const ExitIcon = ({}) => {
    return <div style={iconStyles} onClick={() => history.push('/')}>
        <Typography color="textPrimary">
            Exit Bar
        </Typography>
        <img src={exit_door} height="80%" />
    </div>;
}

const mapStatetoProps = state => ({
    actionInProgress: state.actionInProgress,
    activeTables: state.activeTables
});

const mapDispatchToProps = dispatch => ({
    fetchActiveTables: () => fetchActiveTablesAction(dispatch)
});

export default withTheme(connect(mapStatetoProps, mapDispatchToProps)(Lobby));