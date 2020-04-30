import { drunkLevels } from '../util/drinks';

const initialState = {
    activeTables: null,
    actionInProgress: false,
    currentDrink: null,
    drunkness: drunkLevels[0]
};

const reducer = (state = initialState, action) => {
    let newState = Object.assign({}, state);;
    let index;
    switch(action.type) {
        case "ACTION_IN_PROGRESS":
            newState.actionInProgress = true;
            return newState;
        case "ACTION_DONE":
            newState.actionInProgress = false;
            return newState;
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
        case "SET_ACTIVE_TABLES":
            newState.activeTables = Object.assign({}, action.payload.activeTables);
            return newState;
        case "SET_DRINK": 
            newState.currentDrink = action.payload.currentDrink;
            return newState;
        default:
            return state;
    }
}

export default reducer;