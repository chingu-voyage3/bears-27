import React, { Component } from 'react';

import './UserInfo.css';



export default class UserInfo extends Component {

    render() {
        const { auth, handleLogout } = this.props;

        if(!auth.data ) return null;

        return (
            <div id="user-info-container">
                <div id="user-info-signout" onClick={handleLogout}>
                    <i class="fa fa-sign-out grow fa-2x" 
                    aria-hidden={'Logout, '+ auth.data.name}
                    title={`${auth.data.name}. Logout.`}
                    ></i>
                </div>
            </div> 
        )
    }
}