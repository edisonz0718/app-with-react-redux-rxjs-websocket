import {createStore , applyMiddleware} from "redux";
//import {createEpicMiddleware} from "redux-observable";
import createLogger from "redux-logger";
import rootReducer from "../reducers/root";
//import rootEpic from "../epics/rootEpic";

const loggerMiddleware = createLogger();
//export const epicMiddleware = createEpicMiddleware(rootEpic);

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            //epicMiddleware,
            loggerMiddleware     
        )
    );
}