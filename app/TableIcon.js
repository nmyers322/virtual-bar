import React from 'react';
import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';
import table_icon from './img/table_icon.png';
import { iconStyles } from './styles/iconStyles';
import history from './util/history';
import ParticipantsModal from './ParticipantsModal';

const maxParticipants = 5;

const TableIcon = ({number, room, tableId}) => {
    const [participantsModal, setParticipantsModal] = useState(false);

    const isMaxedOut = () => 
        room && room.participants && room.participants.length >= maxParticipants;

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
            { room &&
                <div className="table-participant-count">
                    { room.loading &&
                        <div className="mini-loader" style={{marginTop: '10px'}}/>
                    }
                    { room.participants && 
                        <Button
                            size="small"
                            onClick={event => {
                                setParticipantsModal(true);
                                event.stopPropagation && event.stopPropagation();
                            }}
                            >
                            <Person /> {room.participants.length} / 5
                        </Button>
                    }
                </div>
            }
            { participantsModal && room.participants &&
                <ParticipantsModal
                    tableNumber={number}
                    participants={room.participants}
                    maxParticipants={maxParticipants}
                    onClose={() => setParticipantsModal(false)}
                    onJoin={() => history.push('/table/' + tableId)} />
            }
        </div>
    );
}

export default withTheme(TableIcon);