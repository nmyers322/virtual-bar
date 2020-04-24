import React, { Component } from 'react';


export default class ComponentWrapper extends Component {
    constructor(props) {
        super(props);

        this.calculateBackgroundStyle = this.calculateBackgroundStyle.bind(this);
       
        this.backgroundImage = this.props.backgroundImage;

        let image = new Image();
        image.onload = () => {
            this.backgroundImageWidth = image.width;
            this.backgroundImageHeight = image.height;
            this.calculateBackgroundStyle();
        }
        image.src = this.backgroundImage;
        
        this.state = {
            componentBackgroundImageStyle: {
                    backgroundImage: 'url(' + this.backgroundImage + ')',
                    backgroundColor: '#181818',
                    backgroundPosition: 'center 0px'
                }
        }
    }

    componentDidMount() {
        this.calculateBackgroundStyle();
        window.addEventListener('resize', this.calculateBackgroundStyle);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculateBackgroundStyle);
    }

    calculateBackgroundStyle() {
        const imageWidth = this.backgroundImageWidth;
        const imageHeight = this.backgroundImageHeight;
        if (imageWidth && imageHeight) {
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            let horizontalOffset;
            
            // Center position by default
            horizontalOffset = Math.min(0, (-((windowHeight/imageHeight)*imageWidth - windowWidth)/2));

            this.setState({
                componentBackgroundImageStyle: {
                    backgroundImage: 'url(' + this.backgroundImage + ')',
                    backgroundColor: '#181818',
                    backgroundPosition: horizontalOffset + 'px 0px'
                }
            });
        }
    }

    render() {
        let {
            componentBackgroundImageStyle
        } = this.state;
        return (
            <div className="component-wrapper">
                <div className="component-background-image" style={componentBackgroundImageStyle} />
                {
                    React.Children.map(this.props.children,
                        child => React.cloneElement(child, {calculateBackgroundStyle: this.calculateBackgroundStyle}))
                }
            </div>
        );
    }
}
