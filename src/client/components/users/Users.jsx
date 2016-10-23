import "./users.scss";
import React , {Component, PropTypes} from "react";
import User from "./User.jsx";

export default class Users extends Component {
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
    render(){
        const numOfUsers = this.state.users.length;
        return (
            <div>     
                <h1>{`${numOfUsers} user${numOfUsers !=1? "s" : ""}`}</h1>                
                <ul className="users">
                    {this.state.users.map(user => (
                        <User key= {user.color} user = {user}/> 
                    ))} 
                </ul>
            </div>
        );
    }
} 


Users.propTypes = {
    usersStore: PropTypes.object.isRequired
};