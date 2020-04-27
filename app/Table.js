import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Video from 'twilio-video';
import axios from 'axios';
import table_abstract from './img/table_abstract.png';
import user from './img/user.png';
import AngleCalculator from './util/angleCalculator';
import { Button, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SwitchCamera from '@material-ui/icons/SwitchCamera';
import Videocam from '@material-ui/icons/Videocam';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Mic from '@material-ui/icons/Mic';
import MicOff from '@material-ui/icons/MicOff';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Person from '@material-ui/icons/Person';
import SyncDisabled from '@material-ui/icons/SyncDisabled';
import ThreeDRotation from '@material-ui/icons/ThreeDRotation';
import history from './util/history';
import moment from 'moment';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.numberOfOtherParticipants = 5;
        this.otherParticipantsArray = Array(this.numberOfOtherParticipants).fill(null).map( (x,i) => i );
        this.centerSeat = 2;
        this.joinOrder = this.otherParticipantsArray.slice().sort((a, b) => Math.abs(a - this.centerSeat) - Math.abs(b - this.centerSeat) || b - a);

        this.addEventLog = this.addEventLog.bind(this);
        this.calculateBackgroundStyle = this.calculateBackgroundStyle.bind(this);
        this.grantDeviceOrientationPermission = this.grantDeviceOrientationPermission.bind(this);
        this.handleMovement = this.handleMovement.bind(this);
        this.handleRoomJoinSuccess = this.handleRoomJoinSuccess.bind(this);
        this.initiateRoom = this.initiateRoom.bind(this);

        this.tableId = this.props.match.params.tableId;

        this.participantRefs = this.otherParticipantsArray.map(i => React.createRef());
        this.centerParticipantRef = this.participantRefs[this.centerSeat];
        this.tableParticipantRowRef = React.createRef();
        this.selfParticipantRef = React.createRef();

        this.backgroundImage = table_abstract;
        let image = new Image();
        image.onload = () => {
            this.backgroundImageWidth = image.width;
            this.backgroundImageHeight = image.height;
            this.calculateBackgroundStyle();
        }
        image.src = this.backgroundImage;

        this.maxDelta = 25;
        this.deltaGranularity = 5;

        this.angleCalculator = null;
        this.currentOrientation = {
            alpha: -1000,
            gamma: -1000
        };
        this.participantScrollValue = -1000;

        this.movementSemaphorReleased = true;

        this.state = {
            audioEnabled: true,
            availableCameras: null,
            deviceOrientationPermissionGranted: typeof DeviceOrientationEvent.requestPermission !== 'function',
            eventLog: [],
            motionScrollEnabled: false,
            participants: this.otherParticipantsArray.map(i => null),
            room: null,
            roomFull: false,
            selectedCamera: 'user',
            tableImageStyle: {
                backgroundImage: 'url(' + this.backgroundImage + ')',
                backgroundColor: '#181818',
                backgroundPosition: 'center 0px'
            },
            videoEnabled: true
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.calculateBackgroundStyle);
        this.initiateRoom();
        // navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices().then(devices => {
        //     this.setState({
        //         availableCameras: devices
        //             .filter(device => device.kind === 'videoinput')
        //             .map(device => device.deviceId)
        //     });
        // });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateBackgroundStyle);
        window.removeEventListener('deviceorientation', this.handleMovement);
        this.state.room && this.state.room.disconnect();
    }

    addEventLog(event) {
        this.setState({
            eventLog: [moment().format('hh:mm:ss') + ': ' + event]
        });
    }

    calculateBackgroundStyle() {
        const imageWidth = this.backgroundImageWidth;
        const imageHeight = this.backgroundImageHeight;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        let horizontalOffset, ratio;
        if (this.tableParticipantRowRef.current) {
            // Follow the participant view
            let currentParticipantRowPosition = this.tableParticipantRowRef.current.scrollLeft;
            ratio = this.tableParticipantRowRef.current.scrollLeft / (this.tableParticipantRowRef.current.scrollWidth - window.innerWidth);
            horizontalOffset = ratio * -(((windowHeight/imageHeight)*imageWidth)-window.innerWidth);
        } else {
            // Center position by default
            ratio = windowHeight/imageHeight;
            horizontalOffset = (-((windowHeight/imageHeight)*imageWidth - windowWidth)/2);
        }
        this.setState({
            tableImageStyle: {
                backgroundImage: 'url(' + this.backgroundImage + ')',
                backgroundColor: '#181818',
                backgroundPosition: Math.min(0, horizontalOffset) + 'px 0px'
            }
        });
    }

    grantDeviceOrientationPermission() {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        this.setState({ deviceOrientationPermissionGranted: true });
                    }
                })
                .catch(error => {
                    console.error(error);
                    history.push('/');
                });
        }
    }

    handleMovement(event) {
        if (this.movementSemaphorReleased && this.state.motionScrollEnabled) {
            let {
                deviceOrientationPermissionGranted
            } = this.state;

            let significantMovementDetected = (alpha, gamma) => {
                let ac = new AngleCalculator({alpha: this.currentOrientation.alpha, gamma: this.currentOrientation.gamma});
                return ac.getAbsoluteDistanceFromStartingPoint(alpha, gamma).distance >= this.deltaGranularity;
            }

            let scrollIncrement = 10;

            const smoothScroll = (newScrollValue) => {
                newScrollValue = Math.floor(newScrollValue);
                if (this.tableParticipantRowRef.current) {
                    let currentScrollValue = Math.floor(this.tableParticipantRowRef.current.scrollLeft);
                    if (currentScrollValue !== newScrollValue) {
                        setTimeout(() => {
                            let incrementedScrollValue = newScrollValue > currentScrollValue
                                        ? (newScrollValue - currentScrollValue) < scrollIncrement
                                            ? newScrollValue
                                            : (currentScrollValue + scrollIncrement)
                                        : (currentScrollValue - newScrollValue) < scrollIncrement
                                            ? newScrollValue
                                            : (currentScrollValue - scrollIncrement);
                            this.tableParticipantRowRef.current.scrollTo({
                                top: 0,
                                left: incrementedScrollValue
                            });
                            smoothScroll(newScrollValue);
                        }, 10);
                    } else {
                        this.movementSemaphorReleased = true;
                    }
                }
            }

            if(deviceOrientationPermissionGranted) {
                let alpha = Math.floor(event.alpha);
                let beta = Math.floor(event.beta);
                let gamma = Math.floor(event.gamma);
                if (this.angleCalculator === null) {
                    this.currentOrientation = { alpha, gamma };
                    this.angleCalculator = new AngleCalculator(this.currentOrientation, this.maxDelta);
                    return;
                } else if (significantMovementDetected(alpha, gamma) && beta > 0 && this.tableParticipantRowRef.current) {
                    this.movementSemaphorReleased = false;
                    let difference = this.angleCalculator.getValidAbsoluteDistanceFromStartingPoint(alpha, gamma);
                    let highestScrollValue = this.tableParticipantRowRef.current.scrollWidth;
                    let newScrollValue = (((difference.distance * difference.direction) + this.maxDelta) / (this.maxDelta * 2)) * (highestScrollValue - window.innerWidth);
                    if (this.participantScrollValue !== newScrollValue) {
                        this.participantScrollValue = newScrollValue;
                    }
                    this.currentOrientation = { alpha, gamma }
                    smoothScroll(newScrollValue);
                }  
            }
        }
    }

    handleRoomJoinSuccess(room) {
        const addParticipant = (participant, tracks) => {
            let seatToTake = null;
            for (let seat of this.joinOrder) {
                if(this.state.participants[seat] === null) {
                    seatToTake = seat;
                    break;
                }
            }
            if (seatToTake !== null) {
                let newParticipants = this.state.participants.slice();
                newParticipants[seatToTake] = participant.identity;
                console.log(participant.identity + ' is taking seat ' + seatToTake);
                this.setState({
                    participants: newParticipants
                },
                    () => {
                        if (tracks) {
                            addParticipantTracks(participant, tracks);
                        }
                    });
            }
        }


        const addParticipantTracks = (participant, tracks) => {
            let index = this.state.participants.findIndex(identity => identity === participant.identity);
            if (index !== -1){
                tracks.forEach(track => this.participantRefs[index].current.firstChild.firstChild.appendChild(track.attach()));
            }
        }

        const removeParticipant = (participant) => {
            removeParticipantTracks(Array.from(participant.tracks.values()));
            let newParticipants = this.state.participants.slice();
            let index = newParticipants.findIndex(identity => identity === participant.identity);
            if (index !== -1) {
                newParticipants[index] = null;
            }
            this.setState({ participants: newParticipants });
        }

        const removeParticipantTracks = (tracks) => 
            tracks.forEach(track => track.detach().forEach(detachedElement => detachedElement.remove()));

        console.log("Joined room", room);
        console.log("Available cameras: ", this.state.availableCameras);

        // If the table is full, kick
        if(room.participants.length > (this.numberOfOtherParticipants + 1)) {
            this.setState({ roomFull: true });
            return;
        }

        // Configure device orientation movement
        window.addEventListener('deviceorientation', this.handleMovement, true);
        this.setState({ room },
            () => this.centerParticipantRef.current && this.centerParticipantRef.current.scrollIntoView({
                    behavior: 'auto',
                    inline: 'center'
                }));

        // Attach yourself
        let selfTracks = Array.from(room.localParticipant.tracks.values());
        selfTracks.forEach(track => this.selfParticipantRef.current.appendChild(track.attach()));

        // Attach the Tracks of the Room's Participants.
        let existingParticipants = [];
        room.participants.forEach(participant => {
            console.log("Already in Room: '" + participant.identity + "'");
            existingParticipants.push(participant.identity);
            addParticipant(participant, Array.from(participant.tracks.values()));
        });
        if (existingParticipants.length > 0) {
            this.addEventLog('Sitting at this table: ' + existingParticipants.join(', ') + '.');
        } else {
            this.addEventLog('There is no one else at this table.');
        }

        // When a Participant joins the Room, log the event.
        room.on('participantConnected', participant => {
            console.log("Joining: '" + participant.identity + "'");
            this.addEventLog(participant.identity + ' has joined.');
            addParticipant(participant);
        });

        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackAdded', (track, participant) => {
            console.log(participant.identity + ' is adding track: ' + track.kind);
            addParticipantTracks(participant, [track]);
        });

        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackRemoved', (track, participant) => {
            console.log(participant.identity + ' is removing track: ' + track.kind);
            removeParticipantTracks([track]);
        });

        // When a Participant leaves the Room, detach everyone then reattach (to reshuffle preferred seats).
        room.on('participantDisconnected', participant => {
            console.log("Participant '" + participant.identity + "' left the room");
            this.addEventLog(participant.identity + ' has left.');
            removeParticipant(participant);
            room.participants.forEach(existingParticipant => removeParticipant(existingParticipant));
            room.participants.forEach(existingParticipant => addParticipant(existingParticipant, Array.from(existingParticipant.tracks.values())));
        });

        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', () => {
            removeParticipantTracks(Array.from(room.localParticipant.tracks.values()));
            room.participants.forEach(participant => removeParticipant(participant));
            this.setState({ room: null });
        });
    }

    initiateRoom() {
        axios.get('/token').then(results => {
            const { token } = results.data;
            this.setState({ token },
                () => {
                    console.log("Joining room '" + this.tableId + "'...");
                    Video.connect(this.state.token, { name: this.tableId })
                        .then(this.handleRoomJoinSuccess, 
                            error => {
                                alert('Could not connect to Twilio: ' + error.message);
                            });
                }
            );
        });
    }

    render() {
        let {
            audioEnabled,
            deviceOrientationPermissionGranted,
            motionScrollEnabled,
            room,
            roomFull,
            selectedCamera,
            tableImageStyle,
            videoEnabled
        } = this.state;

        let grantPermissionButton = () => 
                        <div className="grant-permission-wrapper" style={{
                            marginTop: "30vh",
                            textAlign: "center"
                        }}>
                            <Button 
                                variant="outlined" 
                                color="default" 
                                size="large"
                                onClick={this.grantDeviceOrientationPermission}>
                                Click to grant device permission to move around the table
                            </Button>
                        </div>;

        let joiningTable = () => <div className="joining-table" style={{
                            marginTop: "20vh"
                        }}>
                            <Typography variant="h4" style={{
                                color: "#FFFFFF",
                                textAlign: "center",
                                width: "100%"
                            }}>
                                Joining table...
                            </Typography>
                            <div style={{
                                minHeight: '100px',
                                marginTop: '5vh'
                            }}>
                                <div className="mini-loader" />
                            </div>
                        </div>;


        let tableIsFull = () => <div className="room-full" style={{
                            marginTop: "30vh"
                        }}>
                            <Typography variant="h4">
                                The table you have requested to join is full.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="default" 
                                size="large"
                                onClick={() => history.push('/lobby')}>
                                Go back to lobby
                            </Button>
                        </div>;

        let tableParticipantRow = () => 
                        <div 
                            className="table-participant-row" 
                            onScroll={this.calculateBackgroundStyle}
                            ref={this.tableParticipantRowRef}>
                            <FlexGap />
                            <div ref={this.participantRefs[0]}>
                                <Participant participant={this.state.participants[0]} />
                            </div>
                            <FlexGap />
                            <div ref={this.participantRefs[1]}>
                                <Participant participant={this.state.participants[1]} />
                            </div>
                            <FlexGap />
                            <div ref={this.participantRefs[2]}>
                                <Participant participant={this.state.participants[2]} scrollIntoView={true} />
                            </div>
                            <FlexGap />
                            <div ref={this.participantRefs[3]}>
                                <Participant participant={this.state.participants[3]} />
                            </div>
                            <FlexGap />
                            <div ref={this.participantRefs[4]}>
                                <Participant participant={this.state.participants[4]} />
                            </div>
                            <FlexGap />
                        </div>;

        return (
            <div className="component-wrapper">
                <div className="component-content">
                    <div className="component-background-image" style={tableImageStyle} />
                    { ( (!motionScrollEnabled || (motionScrollEnabled && deviceOrientationPermissionGranted)) ?
                        room ?
                            tableParticipantRow()
                        :
                            ( roomFull ?
                                tableIsFull()
                            :
                                joiningTable()
                            )
                    :
                        grantPermissionButton()
                    ) }
                    { (motionScrollEnabled ? deviceOrientationPermissionGranted : true) && 
                        <div style={{
                            color:"white",
                            marginTop: "5vh",
                            marginLeft: "5vh",
                            marginRight: "5vh"
                        }}>
                            { this.state.eventLog.slice().reverse().map((event, index) => 
                                <Typography style={{fontSize: '10pt'}} key={index}>{event}</Typography>)
                            }
                        </div>
                    }
                </div>
                <div className="table-sticky-footer">
                    <IconButton 
                        edge="start" 
                        color="default" 
                        aria-label="Exit to Lobby" 
                        edge="start"
                        onClick={(event) => {history.push('/lobby')}}>
                        <ExitToApp />
                    </IconButton>
                    { room && motionScrollEnabled &&
                        <IconButton
                            color="default"
                            aria-label="Disable Motion Scrolling"
                            onClick={() => {
                                this.setState({motionScrollEnabled: false});
                                this.angleCalculator = null;
                                this.centerParticipantRef.current && this.centerParticipantRef.current.scrollIntoView({
                                    behavior: 'auto',
                                    inline: 'center'
                                });
                            }}>
                            <ThreeDRotation />
                        </IconButton>
                    }
                    { room && !motionScrollEnabled &&
                        <IconButton
                            color="default"
                            aria-label="Enable Motion Scrolling"
                            onClick={() => this.setState({motionScrollEnabled: true})}>
                            <SyncDisabled />
                        </IconButton>
                    }
                    { false &&
                        <IconButton 
                            color="default" 
                            aria-label="Switch Camera" 
                            onClick={(event) => {
                                // This doesn't seem to work :(
                                let tracks = Array.from(room.localParticipant.videoTracks.values());
                                tracks.forEach(track => {
                                    track.disable();
                                });
                                navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia({
                                    audio: true,
                                    video: {
                                        facingMode: { ideal: selectedCamera === 'user' ? 'environment' : 'user' }
                                    }
                                });
                                tracks.forEach(track => {
                                    track.enable();
                                });
                                this.setState({
                                    selectedCamera: selectedCamera === 'user' ? 'environment' : 'user'
                                });
                            }}>
                            <SwitchCamera />
                        </IconButton>
                    }
                    { room && videoEnabled && (motionScrollEnabled ? deviceOrientationPermissionGranted : true) &&
                        <IconButton 
                            edge="start" 
                            color="default" 
                            aria-label="Turn camera off"
                            onClick={(event) => {
                                if(room) {
                                    let tracks = Array.from(room.localParticipant.videoTracks.values());
                                    tracks.forEach(track => {
                                        track.disable();
                                    });
                                }
                                this.setState({
                                    videoEnabled: false
                                });
                            }}>
                            <Videocam />
                        </IconButton>
                    }
                    { room && !videoEnabled && (motionScrollEnabled ? deviceOrientationPermissionGranted : true) &&
                        <IconButton 
                            edge="start" 
                            color="secondary" 
                            aria-label="Turn camera on"
                            onClick={(event) => {
                                if(room) {
                                    let tracks = Array.from(room.localParticipant.videoTracks.values());
                                    tracks.forEach(track => {
                                        track.enable();
                                    });
                                }
                                this.setState({
                                    videoEnabled: true
                                });
                            }}>
                            <VideocamOff />
                        </IconButton>
                    }
                    { room && audioEnabled && (motionScrollEnabled ? deviceOrientationPermissionGranted : true) &&
                        <IconButton 
                            edge="start" 
                            color="default" 
                            aria-label="Turn microphone off"
                            onClick={(event) => {
                                if(room) {
                                    let tracks = Array.from(room.localParticipant.audioTracks.values());
                                    tracks.forEach(track => {
                                        track.disable();
                                    });
                                }
                                this.setState({
                                    audioEnabled: false
                                });
                            }}>
                            <Mic />
                        </IconButton>
                    }
                    { room && !audioEnabled && (motionScrollEnabled ? deviceOrientationPermissionGranted : true) &&
                        <IconButton 
                            edge="start" 
                            color="secondary" 
                            aria-label="Turn microphone on"
                            onClick={(event) => {
                                if(room) {
                                    let tracks = Array.from(room.localParticipant.audioTracks.values());
                                    tracks.forEach(track => {
                                        track.enable();
                                    });
                                }
                                this.setState({
                                    audioEnabled: true
                                });
                            }}>
                            <MicOff />
                        </IconButton>
                    }
                    { room && (motionScrollEnabled ? deviceOrientationPermissionGranted : true) &&
                        <div className="table-self-participant" ref={this.selfParticipantRef}>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
    
class Participant extends Component {
    render() {
        let userPresentBackgroundStyle = {
            backgroundImage: 'url(' + user + ')',
            backgroundColor: 'rgba(0, 0, 0, .5)',
            backgroundPosition: 'center 0px'
        };
        return (
            <div className="table-participant-wrapper" style={this.props.participant && userPresentBackgroundStyle}>
                <div className="table-participant" style={{opacity: '1'}}>
                </div>
                {this.props.participant &&
                    <Typography style={{color: "#FFFFFF", textAlign: 'center'}}>{ this.props.participant }</Typography>
                }
            </div>
        );
    }
}

class FlexGap extends Component {
    render() {
        return (
            <div className="table-flex-gap">
            </div>
        );
    }
}


