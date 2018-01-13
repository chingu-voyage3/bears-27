import React, { Component } from 'react';
import axios from 'axios';

import './SearchInput.css';


export default class SearchInput extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            input: "",
            searching: false,
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
        this.setState({ searching: true });
        axios.get(`/food/json/near/${input}`)
        .then( (results) => {
            if( !results.data.jsonBody.businesses) throw Error("businesses field doesn't exists");
            this.setState({ searching: false });
            setSuggestions(results.data.jsonBody.businesses);
        })
        .catch( (e) => {
            this.setState({ searching: false });
            console.log("ERROR!", e);
        })
    }

    handleEnterKey(e) {
        if( e.keyCode===13 ) this.handleSearch();
    }

    render() {
        const { suggestions, input, searching } = this.state;
        return (
            <div id="searchInputContainer">
                <div className="field has-addons">
                    <div className="control has-icons-left  is-expanded">
                        <input list="inputLocs"
                        id="searchInput"
                        className="input is-primary" 
                        type="text" 
                        placeholder="Enter location or coords"
                        value={input}
                        onChange={this.handleInputChange.bind(this)}
                        onKeyUp={this.handleEnterKey.bind(this)}
                        />
                        <span className="icon is-small is-left">
                            <i className={`fa fa-${searching ? 'spinner fa-spin' : 'search'}`}></i>
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