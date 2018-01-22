import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group'

import './Panel.css';

export default class Panel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRetracted: true,
            isFoldedItems: props.itinerary.map( () => false ),
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isFoldedItems: nextProps.itinerary.map( () => false )
        })
    }

    handleFoldFactory(targetIndex) {
        const { isFoldedItems } = this.state;
        return () => {
            this.setState({
                ...this.state,
                isFoldedItems: isFoldedItems.map( (e,i) => {
                    if( i===targetIndex ) return !e;
                    return e;
                })
            })
        }
    }

    handleRetract() {
        this.setState({ isRetracted: !this.state.isRetracted });
    }

    render() {
        const { isRetracted, isFoldedItems } = this.state;
        let { itinerary } = this.props;

        itinerary = itinerary.map( (event, i) => {
            event.isFolded = isFoldedItems[i];
            event.handleFoldClick = this.handleFoldFactory(i);
            return event;
        })

        
        
        if(isRetracted) return (
            <CSSTransition
            in={!isRetracted}
            timeout={{
                enter: 500,
                exit: 0,
            }}
            classNames="fade"
            >
            <div id="panelTriggerContainer">
                <div id="panelTriggerIn" onClick={this.handleRetract.bind(this)}>
                    <i className="fa fa-list fa-lg grow" aria-hidden="true"></i>
                </div>
            </div>
            </CSSTransition>
        )
        return (
            <CSSTransition
            in={!isRetracted}
            timeout={{
                enter: 500,
                exit: 0,
            }}
            classNames="fade"
            >
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
            </CSSTransition>
            
        )
    }
}

class ListMarkers extends Component {

    render() {
        const { itinerary } = this.props;
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

    constructor(props) {
        super(props);

        this.state = {
            folded: false,
        }
    }

    handleFoldClick() {
        this.setState({
            folded: !this.state.folded
        })
    }

    render() {
        const { event } = this.props;
        const { folded } = this.state;
        return(
            <li className="markerItem">
                <div className="card">
                    <header className="card-header">
                        <div className="card-header-title card-header-title-list">
                            { event.name }
                        </div>
                        <a className="card-header-icon card-header-icon-list" 
                        onClick={event.handleFoldClick}
                        aria-label="fold-unfold">
                            <span className="icon">
                                <i 
                                className={`fa fa-angle-${event.isFolded ? 'down' : 'up'}`} 
                                aria-hidden="true"></i>
                            </span>
                        </a>
                    </header>
                    { !event.isFolded  &&
                    <div>
                        <div className="card-content">
                            <div className="content">
                                <div className="list-item-field list-item-address">
                                    { event.address.filter( (n) => {
                                        return n !== '[no name]';
                                    }).join(', ').substring(0, 30) + '...' }
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
                    } 
                </div>
            </li>
        )
    }
}

