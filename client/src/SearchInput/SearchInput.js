import React, { Component } from 'react';
import axios from 'axios';

import './SearchInput.css';


export default class SearchInput extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            input: "",
        }
    }

    handleInputChange(e) {
        const { value } = e.target;
        this.setState({
            input: value
        })
    }
    

    handleSearch() {
        const { input } = this.state;
        const { search } = this.props;
        search(input);
    }

    handleEnterKey(e) {
        if( e.keyCode===13 ) this.handleSearch();
    }

    render() {
        const { suggestions, input } = this.state;
        const { isSearching } = this.props;
        return (
            <div id="searchInputContainer">
                <div className="field has-addons">
                    <div className="control has-icons-left  is-expanded">
                        <input list="inputLocs"
                        id="searchInput"
                        className="input is-primary" 
                        type="text" 
                        placeholder="Enter location or zipcode"
                        value={input}
                        onChange={this.handleInputChange.bind(this)}
                        onKeyUp={this.handleEnterKey.bind(this)}
                        />
                        <span className="icon is-small is-left">
                            <i className={`fa fa-${isSearching ? 'spinner fa-spin' : 'search'}`}></i>
                        </span>
                    </div>
                    <div className="control is-pulled-right is-hidden-mobile">
                        <a className="button is-info" onClick={this.handleSearch.bind(this)}>
                            Search
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

