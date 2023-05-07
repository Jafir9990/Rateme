import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

let middlewares = null;
if( process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__)
{
    middlewares = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
}else
{
    middlewares = applyMiddleware(thunk)
}

const store = createStore(rootReducer, middlewares)

export default store;