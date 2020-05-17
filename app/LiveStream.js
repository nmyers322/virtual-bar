import React from 'react';
import VideoPlayer from './react-video-js-player/index.js';
import { withRouter } from 'react-router-dom';

const LiveStream = ({history}) => {
    return (history && history.location && history.location.pathname && (history.location.pathname.includes('table') || history.location.pathname.includes('lobby')))
        ? (
            <div className="livestream">
                <VideoPlayer
                        controls={true}
                        autoplay={true}
                        playsInline={true}
                        src={"http://206.189.78.238:80/hls/947f2adedf9830189393f034c1a63323.m3u8"}
                    />
            </div>
            )
        : null;
}

export default withRouter(LiveStream);