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
                <div id="panelTriggerIn" onClick={this.handleRetract.bind(this)}>
                    <i className="fa fa-list fa-lg grow" aria-hidden="true"></i>
                </div>
            </div>
            
        )
        return (
            <div id="panelContainer">
                <div className="columns">
                    <div className="column is-12">
                        <div id="panelTriggerOut">
                            <i className="fa fa-arrow-circle-o-right grow fa-2x"
                            aria-hidden="true" 
                            onClick={this.handleRetract.bind(this)} 
                            />
                        </div>
                        <div className="is-size-4" id="panel-title">Current itinerary</div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column is-12">
                        <ListMarkers itinerary={itinerary} />
                    </div>
                </div>
            </div>
        )
    }
}

class ListMarkers extends Component {

    render() {
        const { itinerary } = this.props;
        if( !itinerary.length ) itinerary[0] = {
            name: "Test place",
            address: [
                "46TH Street Between Broadway And 9th Ave",
                "Manhattan, NY 10036"
            ],
            phone: '+3 3334 1412',
            attendance: 32,
            location: {
                latitude: (Math.random()-0.5)*100,
                longitude: (Math.random()-0.5)*100
            }
        };
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
                        <div className="card-header-title card-header-title-list">
                            { event.name }
                        </div>
                        <a className="card-header-icon card-header-icon-list" aria-label="more options">
                            <span className="icon">
                                <i className="fa fa-angle-up" aria-hidden="true"></i>
                            </span>
                        </a>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <div className="list-item-field list-item-address">
                                { event.address.join(', ').substring(0, 30) + '...' }
                            </div>
                            <div className="list-item-field list-item-phone">{ event.phone }</div>
                            <div className="list-item-field list-item-attendance">
                                Attendance: <strong>{event.attendance}</strong>
                            </div>
                            <div className="list-item-field list-item-location">
                                { event.location.latitude.toFixed(2) }, {event.location.longitude.toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a className="card-footer-item is-size-7">Details</a>
                        <a className="card-footer-item is-size-7">Delete</a>
                    </footer>
                </div>
            </li>
        )
    }
}

