import alertReducer from "./alertReducer";
import authReducer from "./authReducer";
import departmentReducer from "./departmentReducer";
import progressBarReducer from "./progressBarReducer";
import userReducer from "./userReducer";

const { combineReducers } = require("redux")

const allReducers = {
    auth: authReducer,
    alert: alertReducer,
    progressBar:progressBarReducer,
    departments: departmentReducer,
    users: userReducer,
    
}

const rootReducer = combineReducers(allReducers);

export default rootReducer;