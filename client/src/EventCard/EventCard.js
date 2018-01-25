import React, { Component } from 'react';
import axios from 'axios';

import './EventCard.css';



export default class EventCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);        
    }

    componentDidMount() {
        const { suggestion } = this.props;
        if(!suggestion) return;
        this.setState({
            yelpID: suggestion.id
        })
    }

    componentWillReceiveProps(nextProps) {
        const { suggestion } = nextProps;
        if(!suggestion) return;
        this.setState({
            yelpID: suggestion.id
        })
    }

    handleModalClose() {
        const { setActiveSuggestion } = this.props;
        setActiveSuggestion(undefined);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit() {
        const { setActiveSuggestion, getItinerary } = this.props;
        const { yelpID, date } = this.state;
        if(!yelpID || !date ) return;

        this.setState({ isLoading: true })

        axios.post('/api/events', {
            yelpID: yelpID,
            date: date
        })
        .then( (results) => {
            console.log("RESPONSE POST", results.data);
            this.setState({ isLoading: false })
            setActiveSuggestion(undefined);
            setTimeout( () => getItinerary(), 500);
        })
        .catch( (err) => {
            this.setState({ isLoading: false })
            console.log("Error submiting", err);
        })
    }

    render() {
        const { suggestion } = this.props;
        if (!suggestion) return null;
        const { yelpID, date, isLoading } = this.state;

        return (
        <div id="eventCardContainer">
            <div className={`modal ${suggestion ? "is-active" : ""}`}>
                <div className="modal-background modal-card-background"></div>
                <div className="modal-content">
                    <div id="eventCardContentContainer">
                        <div className="card">
                            <div className="card-image">
                                <figure className="image is-4by3">
                                <img src={suggestion.image_url}  alt="Meaninful text" />
                                </figure>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <div className="title is-4">{suggestion.name}</div>
                                        <div className="subtitle is-size-7	">{suggestion.phone}</div>
                                    </div>
                                </div>

                                <div className="content">
                                    <div>
                                    {suggestion.location.display_address.filter( (n) => {
                                        return n !== '[no name]';
                                    }).join(', ')}
                                    </div>
                                    <div>{`Rating: ${suggestion.rating}/5`}</div>
                                    <div className="has-text-centered">
                                        <b>Date: {'  '}</b>
                                        <input type="date" name="date" 
                                        onChange={this.handleInputChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="field is-grouped">
                                <div className="panel-buttons-container">
                                    <div className="control">
                                        <button 
                                        className="button is-link"
                                        onClick={this.handleSubmit.bind(this)}
                                        disabled={ !yelpID || !date || isLoading }
                                        >
                                            <i 
                                            className={`fa fa-spinner fa-pulse fa-fw ${!isLoading ? 'is-invisible' : ''}`}
                                            ></i>
                                            Submit
                                        </button>
                                    </div>
                                    <div className="control">
                                        <button 
                                        className="button is-text"
                                        onClick={this.handleModalClose.bind(this)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                className="modal-close is-large" 
                aria-label="close"
                onClick={this.handleModalClose.bind(this)}
                ></button>
            </div>
        </div>
        )
    }
}