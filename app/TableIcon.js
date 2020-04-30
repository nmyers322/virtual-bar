import React from 'react';
import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';
import table_icon from './img/table_icon.png';
import { iconStyles } from './styles/iconStyles';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import history from './util/history';

const ParticipantsModal = withTheme(({tableNumber, participants, onClose, onJoin}) => 
    <Modal
        open={true}
        onClose={() => {
            onClose();
        }}
        style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            outline: 'none'
        }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'column',
            backgroundColor: '#333333',
            padding: '2vh',
            border: '0',
            borderRadius: '2vh 2vh',
            outline: 'none'
            }}>
            <Typography color="textPrimary">
                Table { tableNumber } - Current Participants
            </Typography>
            <List>
                { participants.map(participant => 
                    <ListItem key={participant}>
                    <ListItemIcon><Person /></ListItemIcon>
                        <Typography color="textPrimary">
                            { participant }
                        </Typography>
                    </ListItem>) }
            </List>
            <Button 
                variant="contained" 
                color="default" 
                size="large"
                style={{marginTop: '3vh'}}
                onClick={event => {
                    onJoin();
                    event.preventDefault && event.preventDefault();
                }}>
                Join Table
            </Button>
            <Button 
                variant="outlined" 
                color="default" 
                size="small"
                style={{marginTop: '3vh'}}
                onClick={event => {
                    onClose();
                    event.preventDefault && event.preventDefault();
                }}>
                Close
            </Button>
        </div>
    </Modal>);

const TableIcon = ({number, room, tableId}) => {
    const [participantsModal, setParticipantsModal] = useState(false);
    return (
        <div 
            className="table-icon" 
            style={iconStyles}
            onClick={event => !participantsModal && history.push('/table/' + tableId)}>
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
                    onClose={() => setParticipantsModal(false)}
                    onJoin={() => history.push('/table/' + tableId)} />
            }
        </div>
    );
}

export default withTheme(TableIcon);