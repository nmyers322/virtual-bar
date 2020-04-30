import axios from 'axios';

export const fetchActiveTablesAction = dispatch => {
    dispatch({ type: 'ACTION_IN_PROGRESS' });
    axios.get('/api/rooms')
        .then(roomsResponse => {
            console.log("Got rooms response", roomsResponse.data);
            let activeTables = {};
            activeTables.rooms = {};
            roomsResponse.data && roomsResponse.data.rooms && roomsResponse.data.rooms.map(room => {
                activeTables.rooms[room] = { loading: true }
            });
            if (roomsResponse.status === 200) {
                dispatch({ type: 'SET_ACTIVE_TABLES', payload: { activeTables } });
                if(Object.keys(activeTables.rooms).length > 0) {
                    Promise
                        .all(Object.keys(activeTables.rooms)
                            .map(roomId => fetchRoomParticipants(dispatch, roomId)))
                        .then(values => {
                            values.forEach(participantsResponse => {
                                activeTables.rooms[participantsResponse.roomId] = {
                                    loading: false,
                                    participants: participantsResponse.participants
                                };
                            });
                            dispatch({ type: 'SET_ACTIVE_TABLES', payload: { activeTables } });
                            dispatch({ type: 'ACTION_DONE' });
                        })
                        .catch(err => {
                            console.log(err);
                            dispatch({ type: 'ACTION_DONE' });
                        })
                } else {
                    dispatch({ type: 'ACTION_DONE' });
                }
            } else {
                dispatch({ type: 'ACTION_DONE' });
            }
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: 'ACTION_DONE' });
        });
}

const fetchRoomParticipants = (dispatch, roomId) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: 'ACTION_IN_PROGRESS' });
        axios.get('/api/room/' + roomId + '/participants')
            .then(participantResponse => {
                console.log("Got participants response", participantResponse);
                dispatch({ type: 'ACTION_DONE' });
                resolve({roomId: roomId, participants: participantResponse.data && participantResponse.data.participants});
            })
            .catch(err => {
                console.log(err);
                dispatch({ type: 'ACTION_DONE' });
                reject();
            });
    });
}