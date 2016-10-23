import React , {Component, PropTypes} from "react";

export default class User extends Component {
    render(){
        const {user} = this.props;                 
        const userStyle = {
            color: user.color    
        };
        return(
            <li><span className="name" style={userStyle}>{user.name}</span></li> 
        );
    }
}

User.propTypes = {
    user : PropTypes.object.isRequired
};


