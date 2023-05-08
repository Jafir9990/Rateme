import alertReducer from "./alertReducer";
import progressBarReducer from "./progressBarReducer";

const { combineReducers } = require("redux")

const allReducers = {
    alert: alertReducer,
    progressBar:progressBarReducer
    
}

const rootReducer = combineReducers(allReducers);

export default rootReducer;