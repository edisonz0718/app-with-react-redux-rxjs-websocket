
export function opList(users) {
    users.sort((l,r) => l.name.localeCompare(r.name));
    return {
        type: "SERVER_LOAD_USER_LIST",
        users: users
    };
}

export function opAdd(user){
    //console.log("from opAdd");        
    return {
        type: "SERVER_ADD_USER",
        user: user
    };
}

export function opRemove(user) {
        
    return {
        type: "SERVER_REMOVE_USER",
        user: user
    };
}