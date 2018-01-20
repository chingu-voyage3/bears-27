import React, { Component } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

import Map from './Map/Map';
import MapPopup from './Map/MapPopup';
import SearchInput from './SearchInput/SearchInput';
import EventCard from './EventCard/EventCard';
import Panel from './Panel/Panel';
import Login from './Login/Login';
import './App.css';


const KEY_IP_LOC = '02c1559982a189';


class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locs: [],
      floatingLoc: undefined,
      suggestions: [],
      activeSuggestion: undefined,
      isSearching: false,
      itinerary: []
    }
  }

  componentDidMount() {
    /* this.getCurrentPosition(); */
  }

  getCurrentPosition() {
    getCurrentPositionHTML5()
    .then( (pos) => {    
      this.setState({ locs: [ pos, ...this.state.locs ] });
    }, () => {
      getCurrentPositionIP()
      .then( (pos) => {
        this.setState({ locs: [ pos, ...this.state.locs ] });
      })
    })
    .catch( (err) => {
      console.log(err);
    })
  }



  setFloatLoc(loc) {
    this.setState({
      floatingLoc: loc
    });
    this.handleMapSearch(loc);
  }

  addLoc(loc) {
    this.setState({
      locs: [ ...this.state.locs, loc ],
      floatingLoc: undefined
    })
  }

  removeLoc(index) {
    this.setState({
      locs: this.state.locs.splice(index, 1)
    })
  }

  removeLocFactory(index) {
    return () => {
      const { locs } = this.state;
      const newLocs = [...locs];
      newLocs.splice(index, 1);
      this.setState({
        locs: newLocs
      })
    }
  }

  setSuggestions(newSugs) {
    this.setState({
      suggestions: newSugs
    })
  }

  setActiveSuggestion(suggestion) {
    this.setState({
      activeSuggestion: suggestion
    })
  }

  handleInputSearch(input) {
    this.setState({isSearching: true});
    axios.get(`/food/json/near/${input}`)
    .then( (results) => {
        if( !results.data.jsonBody.businesses) throw Error("businesses field doesn't exists. Wrong response.");
        this.setState({ isSearching: false });
        this.setSuggestions(results.data.jsonBody.businesses);
    })
    .catch( (e) => {
        this.setState({ isSearching: false });
        console.log("ERROR!", e);
    })
  }

  handleMapSearch(loc) {
    console.log('MAP searching', loc);
    this.setState({isSearching: true});
    axios.get(`/near/${loc[0]}/${loc[1]}`)
    .then( (results) => {
        if( !results.data.jsonBody.businesses) throw Error("businesses field doesn't exists. Wrong response.");
        this.setState({ isSearching: false });
        this.setSuggestions(results.data.jsonBody.businesses);
    })
    .catch( (e) => {
        this.setState({ isSearching: false });
        console.log("ERROR!", e);
    })
  }

  handleGoogleLogin() {
    window.open('/auth/google');
  }

  render() {
    const { locs, floatingLoc, suggestions, activeSuggestion, isSearching, itinerary } = this.state;
    return (
      <App  
      locs={locs}
      floatingLoc={floatingLoc}
      removeLocFactory={this.removeLocFactory.bind(this)}
      setSuggestions={this.setSuggestions.bind(this)}
      suggestions={suggestions}
      setActiveSuggestion={this.setActiveSuggestion.bind(this)}
      activeSuggestion={activeSuggestion}
      handleMapSearch={this.handleMapSearch.bind(this)}
      handleInputSearch={this.handleInputSearch.bind(this)}
      isSearching={isSearching}
      locHelpers={{
        add: this.addLoc.bind(this),
        remove: this.removeLoc.bind(this),
        setFloater: this.setFloatLoc.bind(this)
      }}
      itinerary={itinerary}
      handleGoogleLogin={this.handleGoogleLogin.bind(this)}
      />
    );
  }
}




class App extends Component {
  render() {
    const { 
      locs, locHelpers, floatingLoc, 
      suggestions, setActiveSuggestion, activeSuggestion,
      handleMapSearch, handleInputSearch, isSearching,
      itinerary,
      handleGoogleLogin
    } = this.props;
    return (
      <div className="App">
        <div className="columns is-gapless">
          <div className="column is-12" id="contentContainer">
            <Login 
            handleGoogleLogin={handleGoogleLogin}
            />
            <EventCard 
            suggestion={activeSuggestion} 
            setActiveSuggestion={setActiveSuggestion}
            />
            <SearchInput search={handleInputSearch} isSearching={isSearching}/>
            <Map 
            locs={locs} 
            locHelpers={locHelpers} 
            floatingLoc={floatingLoc} 
            suggestions={suggestions}
            setActiveSuggestion={setActiveSuggestion}
            />
            <Panel 
            itinerary={itinerary} 
            />
            {/* <MapPopup loc={floatingLoc} locHelpers={locHelpers} /> */}
          </div>
        </div>
      </div>
    );
  }
}


function getCurrentPositionIP() {
  return axios.get('https://ipinfo.io', {
    params: {
      token: KEY_IP_LOC
    }
  })
  .then( (res) => {
    return res.data.loc.split(",").map(Number);
  })
  .catch( (err) => {
    console.log(err);
  })
}


function getCurrentPositionHTML5() {
  return new Promise( (resolve, reject) => {
    if( !navigator.geolocation ) reject( { code: 1 /*PERMISSION_DENIED*/} )
    navigator.geolocation.getCurrentPosition( (position) => {
      resolve([position.coords.latitude, position.coords.longitude]);
    }, (error) => reject(error) );
  })
}

export default AppContainer;
