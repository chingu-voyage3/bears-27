import React, { Component } from 'react';
import './Panel.css';

export default class Panel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRetracted: true
        }
    }

    handleRetract() {
        this.setState({ isRetracted: !this.state.isRetracted });
    }


    render() {
        const { itinerary } = this.props;
        const { isRetracted } = this.state;
        if(isRetracted) return (
            <div id="panelTriggerContainer">
                <div id="panelTrigger">
                    <i class="fa fa-list fa-lg grow" aria-hidden="true" onClick={this.handleRetract.bind(this)}></i>
                </div>
            </div>
            
        )
        return (
            <div id="panelContainer">
                <div className="columns">
                    <div className="column is-12">
                        <i className="fa fa-arrow-circle-o-right grow" 
                        aria-hidden="true" 
                        onClick={this.handleRetract.bind(this)}></i>
                        Current itinerary
                        <ListMarkers itinerary={itinerary} />
                    </div>
                </div>
            </div>
        )
    }
}

class ListMarkers extends Component {

    render() {
        const itinerary = this.props.itinerary || ["default message for no itinerary"];
        return (
            <aside className="menu">            
                <ul className="menu-list">
                    { itinerary.map( (event, i) => <MarkerItem 
                    key={`marker${i}`} 
                    event={event}
                    />)}
                </ul>
            </aside>
        )
    }
}


class MarkerItem extends Component {

    render() {
        const { event } = this.props;
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
                            Event info!!
                            <br />
                            {/* <time dateTime={Date.now()}>{Date.now()}</time> */}
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a className="card-footer-item is-size-7">Edit</a>
                        <a className="card-footer-item is-size-7">Delete</a>
                    </footer>
                </div>
            </li>
        )
    }
}

