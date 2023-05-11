import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import progressBarReducer from "./progressBarReducer";

const { combineReducers } = require("redux")

const allReducers = {
    auth: authReducer,
    alert: alertReducer,
    progressBar:progressBarReducer
    
}

const rootReducer = combineReducers(allReducers);

export default rootReducer;