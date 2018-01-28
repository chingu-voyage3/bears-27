import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group'

import './Panel.css';

export default class Panel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRetracted: true,
            isFoldedItems: props.itinerary.events.map( () => false ),
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isFoldedItems: nextProps.itinerary.events.map( () => false )
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

    
    handleRemoveEventFactory(itineraryID, eventID ) {
        const { removeEvent } = this.props;
        return () => removeEvent(itineraryID, eventID);
    }


    render() {
        const { isRetracted, isFoldedItems } = this.state;
        const { itinerary, removeEvent } = this.props;

        const events = itinerary.events.map( (event, i) => {
            event.isFolded = isFoldedItems[i];
            event.handleFoldClick = this.handleFoldFactory(i);
            event.handleRemoveClick = this.handleRemoveEventFactory( itinerary._id, i)
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
            <div id="panelTriggerContainer" onClick={this.handleRetract.bind(this)}>
                <div id="panelTriggerIn" >
                    <i className="fa fa-list grow" aria-hidden="true"></i>
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
                <div id="panelTriggerOut" className="is-pulled-right">
                    <i className="fa fa-arrow-circle-o-left grow fa-2x"
                    aria-hidden="true" 
                    onClick={this.handleRetract.bind(this)} 
                    />
                </div>
                <div className="columns">
                    <div className="column is-12">
                        <div className="is-size-4" id="panel-title">Current itinerary</div>
                    </div>
                </div>
                

                <div className="columns">
                    <div className="column is-12">
                        <ListMarkers events={events} />
                    </div>
                </div>
            </div>
            </CSSTransition>
            
        )
    }
}

class ListMarkers extends Component {

    render() {
        const { events, removeEvent } = this.props;
        return (
            <aside className="menu">            
                <ul className="menu-list">
                    { events.map( (event, i) => <MarkerItem 
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
        return(
            <li className="markerItem">
                <div className="card">
                    <header className="card-header">
                        <div className="card-header-title card-header-title-list">
                            { event.eventData.locationName }
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
                    <div className="card-content-container">
                        <div className="card-content">
                            <div className="content">
                                <div className="list-item-field list-item-address">
                                    { event.eventData.address }
                                </div>
                                <div className="list-item-field list-item-date">{ event.eventData.eventDate }</div>
                                <div className="list-item-field list-item-attendance">
                                    Confirmed attending: <strong>{event.eventData.confirmedAttending.length}</strong>
                                </div>
                                <div className="list-item-field list-item-attendance">
                                    Possibly attending: <strong>{event.eventData.possiblyAttending.length}</strong>
                                </div>
                                
                            </div>
                        </div>
                        <footer className="card-footer">
                            <a className="card-footer-item is-size-7 card-footer-item-disabled">Details</a>
                            <a className="card-footer-item is-size-7" onClick={event.handleRemoveClick}>Delete</a>
                        </footer>
                    </div>
                    } 
                </div>
            </li>
        )
    }
}

