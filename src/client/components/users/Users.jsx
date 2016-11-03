import "./users.scss";
import React , {Component, PropTypes} from "react";
import User from "./User.jsx";

export default class Users extends Component {
    /*
    constructor(props){
        super(props); 
        this.state = {
            users:[]     
        };
    }
    
    componentDidMount(){
        this.props.usersStore.state$
            .map(action => action.state.users)
            .subscribe(users => this.setState({users}));
    }
    */
    render(){
        const {users} = this.props.users;
        const numOfUsers = users.length;
        return (
            <section className="users">     
                <h1>{`${numOfUsers} user${numOfUsers !=1? "s" : ""}`}</h1>                
                <ul className="users">
                    {users.map(user => (
                        <User key= {user.color} user = {user}/> 
                    ))} 
                </ul>
            </section>
        );
    }
} 


Users.propTypes = {
    users: PropTypes.object.isRequired
    //usersStore: PropTypes.object.isRequired
};