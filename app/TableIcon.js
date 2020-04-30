import React from 'react';
import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';
import table_icon from './img/table_icon.png';
import { iconStyles } from './styles/iconStyles';
import history from './util/history';
import ParticipantsModal from './ParticipantsModal';

const TableIcon = ({number, room, tableId, tableSize}) => {
    const [participantsModal, setParticipantsModal] = useState(false);

    const isMaxedOut = () => 
        room && room.participants && room.participants.length >= tableSize;

    return (
        <div 
            className={isMaxedOut() ? "table-icon-disabled" : "table-icon"}
            style={iconStyles}
            onClick={event => {
                    if (!participantsModal && !isMaxedOut()) {
                        history.push('/table/' + tableId)
                    }
                }}>
            <Typography color="textPrimary">
                Table { number }
            </Typography>
            <img src={table_icon} width="80%" height="80%" />
            <div className="table-participant-count">
                { room && room.loading &&
                    <div className="mini-loader" style={{marginTop: '10px'}}/>
                }
                <Button
                    size="small"
                    disabled={!(room && room.participants && room.participants.length > 0)}
                    onClick={event => {
                        setParticipantsModal(true);
                        event.stopPropagation && event.stopPropagation();
                    }}
                    >
                    <Person /> {room && room.participants ? room.participants.length : 0} / {tableSize}
                </Button>
            </div>
            { participantsModal &&
                <ParticipantsModal
                    tableNumber={number}
                    participants={room && room.participants ? room.participants : []}
                    maxParticipants={tableSize}
                    onClose={() => setParticipantsModal(false)}
                    onJoin={() => history.push('/table/' + tableId)} />
            }
        </div>
    );
}

export default withTheme(TableIcon);