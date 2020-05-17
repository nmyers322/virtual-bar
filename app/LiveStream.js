import React from 'react';
import VideoPlayer from './react-video-js-player/index.js';
import { withRouter } from 'react-router-dom';

const liveStreamSource = false;

const LiveStream = ({history}) => {
    return (!!liveStreamSource && 
            history && 
            history.location && 
            history.location.pathname && 
            (history.location.pathname.includes('table') || history.location.pathname.includes('lobby')))
        ? (
            <div className="livestream">
                <VideoPlayer
                        controls={true}
                        autoplay={true}
                        playsInline={true}
                        src={liveStreamSource}
                    />
            </div>
            )
        : null;
}

export default withRouter(LiveStream);