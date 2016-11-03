import findIndex from "lodash/findIndex";

const initialState = {
    users: []
};

export default function users(state = initialState, action) {
    switch(action.type) {
    case "SERVER_LOAD_USER_LIST":
        return Object.assign({},state,{
            users:action.users
        });
    case "SERVER_ADD_USER": {
        const {users} = state;
        let insertIndex = findIndex(users,
            u=> u.name.localeCompare(action.user.name)> 0);
        if(insertIndex === -1)
            insertIndex = users.length;
            
        users.splice(insertIndex, 0 , action.user);    
        return Object.assign({},state,{
            users
        });
    }
    case "SERVER_REMOVE_USER": {
        const {users} = state;     
        const index = findIndex(users, {name: action.user.name});
        if(index !== -1){
            users.splice(index, 1);
        }
        return Object.assign({},state,{
            users
        });
    }
        
    default:
        return state;
    
    }    
}