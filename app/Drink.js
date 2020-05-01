import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';

const Drink = ({drink, emptyDrink, increaseDrunkness}) => {
    let [classes, setClasses] = React.useState('drink-full');
    const calculateDrinkState = () => {
        switch (classes) {
            case 'drink-full':
                setClasses('drink-half-full');
                break;
            case 'drink-half-full':
                setClasses('drink-almost-gone');
                break;
            case 'drink-almost-gone':
                setClasses('drink-empty');
                setTimeout(() => {
                    emptyDrink();
                    increaseDrunkness();
                    setClasses('drink-full')
                }, 1000);
                break;
        }
    }
    return <Box zIndex="tooltip">
        { drink &&
            <img 
                src={drink.url} 
                className={"drink " + classes} 
                onClick={() => calculateDrinkState(classes)}
            />
        }
    </Box>;
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    emptyDrink: () => dispatch({type: 'EMPTY_DRINK'}),
    increaseDrunkness: () => dispatch({type: "INCREASE_DRUNKNESS"})
});

export default connect(mapStateToProps, mapDispatchToProps)(Drink);