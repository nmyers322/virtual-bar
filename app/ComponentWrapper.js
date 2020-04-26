import React, { Component } from 'react';


export default class ComponentWrapper extends Component {
    constructor(props) {
        super(props);

        this.backgroundImage = this.props.backgroundImage;
    }

    render() {
        return (
            <div className="component-wrapper">
                <div className="component-background-image" style={{
                    backgroundImage: 'url(' + this.backgroundImage + ')',
                    backgroundColor: '#181818',
                    backgroundPosition: 'center 0px'
                }} />
                {
                    React.Children.map(this.props.children,
                        child => React.cloneElement(child, {}))
                }
            </div>
        );
    }
}
