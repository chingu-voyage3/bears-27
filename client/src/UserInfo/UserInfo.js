import React, { Component } from 'react';

import './UserInfo.css';



export default class UserInfo extends Component {

    render() {
        const { auth } = this.props;

        if(!auth.data ) return null;

        return (
            <div id="user-info-container">
                <div id="user-info-name" className=" is-hidden-mobile">{auth.data.name.substr(0, 10)}</div>
                <div id="user-info-logout" className="">Logout</div>
            </div> 
        )
    }
}