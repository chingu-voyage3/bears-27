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
                    <InputLocation setSuggestions={setSuggestions}/>
                    <ListMarkers locs={this.props.locs} removeLocFactory={removeLocFactory}/>
                </div>
            </div>
        )
    }
}


class InputLocation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            input: "",
            suggestions: []
        }

        this.getSuggestions = debounce( this.getSuggestions.bind(this), 750);
    }

    handleInputChange(e) {
        const { value } = e.target;
        /* if( value.length > 3) this.getSuggestions(e.target.value); */
        this.setState({
            input: value
        })
    }
    
    getSuggestions(val) {
        /* geocoder.geocode(val, ( err, data ) => {
            if(err) return;
            this.setState({
                suggestions: data.results.map( (result) => result.formatted_address)
            })
        }); */
    }

    handleSearch() {
        const { input } = this.state;
        const { setSuggestions } = this.props;
        axios.get(`/food/json/near/${input}`)
        .then( (results) => {
            if( !results.data.jsonBody.businesses) throw Error("businesses field doesn't exists")
            setSuggestions(results.data.jsonBody.businesses);
        })
        .catch( (e) => {
            console.log("ERROR!", e);
        })
    }

    handleEnterKey(e) {
        if( e.keyCode===13 ) this.handleSearch();
    }

    render() {
        const { suggestions, input } = this.state;
        return (
            <div>
                <div className="field has-addons">
                    <div className="control has-icons-left  is-expanded">
                        <input list="inputLocs" 
                        className="input is-primary" 
                        type="text" 
                        placeholder="Enter location or coords"
                        value={input}
                        onChange={this.handleInputChange.bind(this)}
                        onKeyUp={this.handleEnterKey.bind(this)}
                        />
                        <span className="icon is-small is-left">
                          <i className="fa fa-search"></i>
                        </span>
                        { suggestions.length > 0 && 
                        <datalist id="inputLocs">
                            { suggestions.map( (suggestion) => <option key={suggestion} value={suggestion} />)}
                        </datalist>
                        }       
                    </div>
                    <div className="control is-pulled-right">
                        <a className="button is-info" onClick={this.handleSearch.bind(this)}>
                        Search
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}


function debounce(callback, wait, context = this) {
    let timeout = null 
    let callbackArgs = null
    
    const later = () => callback.apply(context, callbackArgs)
    
    return function() {
      callbackArgs = arguments
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
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

