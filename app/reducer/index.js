const initialState = {

};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export default reducer;