import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core/styles';
import Person from '@material-ui/icons/Person';
import Modal from '@material-ui/core/Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const ParticipantsModal = ({tableNumber, participants, maxParticipants, onClose, onJoin}) => 
    <Modal
        open={true}
        onClose={() => {
            onClose();
        }}
        style={{
            display: 'flex',
            justifyContent: 'center',
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
            outline: 'none',
            maxWidth: '400px',
            margin: 'auto'
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
            { participants.length >= maxParticipants &&
                <Typography color="textPrimary">
                    Table is full. Cannot join!
                </Typography>
            }
            <Button 
                variant="contained" 
                color="default" 
                size="large"
                style={{marginTop: '3vh'}}
                disabled={participants.length >= maxParticipants}
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
    </Modal>;

export default withTheme(ParticipantsModal);