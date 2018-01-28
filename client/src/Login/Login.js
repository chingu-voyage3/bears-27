import React, { Component }  from 'react';

import './Login.css'


export default class Login extends Component {

    render() {
        const { handleGoogleLogin, auth } = this.props;
        
        return (
            <div id="loginContainer">
                <div className={`modal ${!auth.isLoggedIn && !auth.isLoading ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="title" id="app-title">
                            Bears-27 Voyage3 App
                        </div>
                        <div className="subtitle" id="app-description">
                            An app that allows you to locate, schedule and share with other people events.
                        </div>
                        <div className="columns">
                            <div className="column is-4 is-offset-4">
                                <div id="login-buttons-container">
                                    <button className="loginBtn loginBtn--google" onClick={handleGoogleLogin}>
                                        Login with Google
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        )
    }
}