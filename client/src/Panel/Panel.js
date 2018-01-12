import React, { Component } from 'react';
import axios from 'axios';
import './Panel.css';

export default class Panel extends Component {

    render() {
        const { removeLocFactory, setSuggestions } = this.props;
        return (
            <div id="panelContainer">
                <div className="column is-12">
                    PANEL TITLE!
                    <ListMarkers locs={this.props.locs} removeLocFactory={removeLocFactory}/>
                </div>
            </div>
        )
    }
}

class ListMarkers extends Component {

    render() {
        const locs = this.props.locs || ["default message for no locations"];
        const { removeLocFactory } = this.props;
        return (
            <aside className="menu">            
                <ul className="menu-list">
                    { locs.map( (loc, i) => <MarkerItem 
                    key={`marker${i}`} 
                    index={`marker${i}`}
                    loc={loc} 
                    removeLoc={removeLocFactory(i)}
                    />)}
                </ul>
            </aside>
        )
    }
}


class MarkerItem extends Component {

    render() {
        const { loc, removeLoc } = this.props;
        return(
            <li className="markerItem">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">
                            Location
                        </p>
                        <a className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className="fa fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            {loc[0].toFixed(3)},{loc[1].toFixed(3)}
                            <br />
                            {/* <time dateTime={Date.now()}>{Date.now()}</time> */}
                            <div>{this.props.index}</div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a className="card-footer-item is-size-7">Edit</a>
                        <a className="card-footer-item is-size-7" onClick={removeLoc}>Delete</a>
                    </footer>
                </div>
            </li>
        )
    }
}

