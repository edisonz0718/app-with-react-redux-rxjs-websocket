import {combineEpics} from "redux-observable";
//import {serverAddUserEpic} from "./usersEpic";

const rootEpic = combineEpics(
    //serverAddUserEpic        
);

export default rootEpic;