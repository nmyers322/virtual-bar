import React from 'react';
import table_abstract from './img/table_abstract.png';
import lobby from './img/lobby.png';
import entry from './img/entry.png';

export default class PreloadImages extends React.Component {
    render() {
        return <div className="preload-images">
            <img src={lobby} />
            <img src={table_abstract} />
            <img src={entry} />
            
        </div>;
    }
}