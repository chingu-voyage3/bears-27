import React, { Component }  from 'react';

import './Login.css'


export default class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            isModalActive: true,
        }
    }
    
    handleCloseModal() {
        this.setState({
            isModalActive: !this.state.isModalActive
        })
    }

    render() {
        const { handleGoogleLogin } = this.props;
        const { isModalActive } = this.state;
        return (
            <div id="loginContainer">
                <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
                    <div className="modal-background"></div>
                    <div className="modal-content has-has-text-centered">
                        <button className="loginBtn loginBtn--google" onClick={handleGoogleLogin}>
                            Login with Google
                        </button>
                    </div>

                    {/* This button will be removed in the future */}
                    {/* <button 
                    className="modal-close is-large" 
                    aria-label="close" 
                    onClick={this.handleCloseModal.bind(this)}
                    ></button> */}
                </div>
            </div>
        )
    }
}