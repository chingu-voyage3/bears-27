import React, { Component } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

import Map from './Map/Map';
import MapPopup from './Map/MapPopup';
import SearchInput from './SearchInput/SearchInput';
import EventCard from './EventCard/EventCard';
import Panel from './Panel/Panel';
import './App.css';
import TripCard from './components/TripCard'


const KEY_IP_LOC = '02c1559982a189';


class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locs: [],
      floatingLoc: undefined,
      suggestions: [],
      activeSuggestion: undefined,
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
    })
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

  render() {
    const { locs, floatingLoc, suggestions, activeSuggestion } = this.state;
    return (
      <App  
      locs={locs}
      floatingLoc={floatingLoc}
      removeLocFactory={this.removeLocFactory.bind(this)}
      setSuggestions={this.setSuggestions.bind(this)}
      suggestions={suggestions}
      setActiveSuggestion={this.setActiveSuggestion.bind(this)}
      activeSuggestion={activeSuggestion}
      locHelpers={{
        add: this.addLoc.bind(this),
        remove: this.removeLoc.bind(this),
        setFloater: this.setFloatLoc.bind(this)
      }}
      />
    );
  }
}




class App extends Component {
  render() {
    const { 
      locs, locHelpers, floatingLoc, 
      setSuggestions, suggestions, 
      setActiveSuggestion,activeSuggestion 
    } = this.props;
    return (
      <div className="App">
        <div className="columns is-gapless">
          {/* <div className="column is-one-third">
            <Panel 
            locs={locs} 
            locHelpers={locHelpers} 
            removeLocFactory={removeLocFactory} 
            setSuggestions={setSuggestions}
            />
          </div> */}
          <div className="column is-12" id="contentContainer">
            <EventCard 
            suggestion={activeSuggestion} 
            setActiveSuggestion={setActiveSuggestion}
            />
            <SearchInput setSuggestions={setSuggestions}/>
            <Map 
            locs={locs} 
            locHelpers={locHelpers} 
            floatingLoc={floatingLoc} 
            suggestions={suggestions}
            setActiveSuggestion={setActiveSuggestion}
            />
            <MapPopup loc={floatingLoc} locHelpers={locHelpers} />
          </div>
        </div>
      </div>
    );
  }
}

/* axios.get('https://ipinfo.io', {
  params: {
    token: KEY_IP_LOC
  }
})
.then( (res) => {
  var { locs } = this.state;      
  const initLoc = res.data.loc.split(",").map(Number);
  this.setState({
    locs: [ initLoc, ...locs ]
  });
})
.catch( (err) => {
  console.log(err);
}) */

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
