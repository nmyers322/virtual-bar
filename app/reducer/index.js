import { drunkLevels } from '../util/drinks';

const initialState = {
    currentDrink: null,
    drunkness: drunkLevels[0]
};

const reducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);;
    let index;
    switch(action.type) {
        case "DECREASE_DRUNKNESS":
            index = Object.keys(drunkLevels).findIndex(index => drunkLevels[index] === state.drunkness);
            if (index !== -1) {
                newState.drunkness = drunkLevels[Math.max((index - 1), 0)];
            }
            return newState;
        case "EMPTY_DRINK":
            newState.currentDrink = null;
            return newState;
        case "INCREASE_DRUNKNESS":
            index = Object.keys(drunkLevels).findIndex(index => drunkLevels[index] === state.drunkness);
            if (index !== -1) {
                newState.drunkness = drunkLevels[Math.min((index + 1), (Object.keys(drunkLevels).length - 1))];
            }
            return newState;
        case "RESET":
            return initialState;
        case "SET_DRINK": 
            newState.currentDrink = action.payload.currentDrink;
            return newState;
        default:
            return state;
    }
}

export default reducer;