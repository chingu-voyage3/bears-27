import React, { Component }  from 'react';

import './Login.css'


export default class Login extends Component {

    constructor(props){
        super(props);

    }
    

    render() {
        const { handleGoogleLogin, auth } = this.props;
        
        return (
            <div id="loginContainer">
                <div className={`modal ${!auth.isLoggedIn && !auth.isLoading ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-content has-has-text-centered">
                        <button className="loginBtn loginBtn--google" onClick={handleGoogleLogin}>
                            Login with Google
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}