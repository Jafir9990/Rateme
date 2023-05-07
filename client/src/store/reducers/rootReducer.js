import alertReducer from "./alertReducer";

const { combineReducers } = require("redux")

const allReducers = {
    alert: alertReducer
    
}

const rootReducer = combineReducers(allReducers);

export default rootReducer;