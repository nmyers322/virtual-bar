import React from 'react';
import table_abstract from './img/table_abstract.png';
import lobby from './img/lobby.png';
import entry from './img/entry.png';
import { drinks } from './util/drinks';
import drunk_space from './img/drunk-space.gif';

export default class PreloadImages extends React.Component {
    render() {
        return <div className="preload-images">
            <img src={lobby} />
            <img src={table_abstract} />
            <img src={entry} />
            <img src={drunk_space} />
            { Object.keys(drinks).map(drink => <img src={drinks[drink].url} key={drinks[drink].name + " preload-img"} />) }
        </div>;
    }
}