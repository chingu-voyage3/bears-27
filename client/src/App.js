import React, { Component } from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

import Map from './Map/Map';
import UserInfo from './UserInfo/UserInfo';
import CategoryChooser from './CategoryChooser/CategoryChooser';
import SearchInput from './SearchInput/SearchInput';
import EventCard from './EventCard/EventCard';
import Panel from './Panel/Panel';
import Login from './Login/Login';
import './App.css';


const KEY_IP_LOC = '02c1559982a189';
const CATEGORIES = [
  'food',
  'bars',
  'entertainment'
]


class AppContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      locs: [],
      floatingLoc: undefined,
      suggestions: [],
      activeSuggestion: undefined,
      isSearching: false,
      itinerary: [],
      categoryIndex: 0,
      auth: {
        isLoggedIn: false,
        loading: true,
        data: null
      }
    }

    this.getItinerary = debounce( this.getItinerary.bind(this), 750);
  }

  componentDidMount() {
    /* this.getCurrentPosition(); */
    this.getItinerary();
    this.getProfile();
  }

  componentDidUpdate() {
    this.getItinerary();
  }

  getProfile() {
    axios.get('/profile')
    .then( (results) => {
      this.setState({
        auth: {
          isLoggedIn: true,
          loading: true,
          data: results.data
        }
      })
    })
    .catch( (err) => {
      this.setState({
        auth: {
          isLoggedIn: false,
          loading: false,
          data: null
        }
      })
    })
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
    if(!loc) return;
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
    const { categoryIndex } = this.state;
    this.setState({isSearching: true});
    axios.get(`/api/places/near/${input}/category/${CATEGORIES[categoryIndex]}`)
    .then( (results) => {
        if( !results.data.businesses) throw Error("businesses field doesn't exists. Wrong response.");
        this.setState({ isSearching: false });
        console.log(results.data);
        this.setSuggestions(results.data.businesses.filter( (b) => {
          return b.coordinates && b.coordinates.latitude && b.coordinates.longitude;
        }));
    })
    .catch( (e) => {
        this.setState({ isSearching: false });
        console.log("ERROR!", e);
    })
  }

  handleMapSearch(loc) {
    const { categoryIndex } = this.state;
    this.setState({isSearching: true});
    axios.get(`/api/places/near/${loc[0]}/${loc[1]}/category/${CATEGORIES[categoryIndex]}`)
    .then( (results) => {
        if( !results.data.businesses) throw Error("businesses field doesn't exists. Wrong response.");
        this.setState({ isSearching: false });
        this.setSuggestions(results.data.businesses.filter( (b) => {
          return b.coordinates && b.coordinates.latitude && b.coordinates.longitude;
        }));
    })
    .catch( (e) => {
        this.setState({ isSearching: false });
        console.log("ERROR!", e);
    })
  }

  getItinerary() {
    console.log("GETING ITINERARY");

    axios.get('/api/itineraries/mine')
    .then((response) => {
      console.log("GOT ITINERARY", response.data);
    })
    .catch( (err) => {
      console.log(err);
    })
  }

  handleGoogleLogin() {
    window.location.replace("/auth/google");
  }

  setCategory(index) {
    this.setState({
      categoryIndex: index
    })
  }

  render() {
    const { locs, floatingLoc, suggestions, activeSuggestion, 
      isSearching, itinerary, categoryIndex, auth } = this.state;
    return (
      <App  
      locs={locs}
      floatingLoc={floatingLoc}
      removeLocFactory={this.removeLocFactory.bind(this)}
      setSuggestions={this.setSuggestions.bind(this)}
      suggestions={suggestions}
      setActiveSuggestion={this.setActiveSuggestion.bind(this)}
      activeSuggestion={activeSuggestion}
      handleInputSearch={this.handleInputSearch.bind(this)}
      isSearching={isSearching}
      setCategory={this.setCategory.bind(this)}
      categoryIndex={categoryIndex}
      locHelpers={{
        add: this.addLoc.bind(this),
        remove: this.removeLoc.bind(this),
        setFloater: this.setFloatLoc.bind(this)
      }}
      itinerary={itinerary}
      login= {{
        handleGoogleLogin: this.handleGoogleLogin.bind(this),
        auth: auth
      }}
      
      />
    );
  }
}




class App extends Component {
  render() {
    const { 
      locs, locHelpers, floatingLoc, 
      suggestions, setActiveSuggestion, activeSuggestion,
      handleInputSearch, isSearching, setCategory, categoryIndex,
      itinerary,
      login
    } = this.props;

    /* if( !itinerary.length ) {
      itinerary[0] = {
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
          },
          isFolded: false
      };
      itinerary[1] = {
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
          },
          isFolded: true
      };
  } */


    return (
      <div className="App">
        <div className="columns is-gapless">
          <div className="column is-12" id="contentContainer">
            <Login 
            handleGoogleLogin={login.handleGoogleLogin}
            auth={login.auth}
            />
            <EventCard 
            suggestion={activeSuggestion} 
            setActiveSuggestion={setActiveSuggestion}
            />
            <CategoryChooser 
            current={categoryIndex} 
            categories={CATEGORIES}
            onChange={setCategory}
            />
            <UserInfo 
            auth={login.auth}
            />
            <SearchInput search={handleInputSearch} isSearching={isSearching}/>
            <Map 
            locs={locs} 
            locHelpers={locHelpers} 
            floatingLoc={floatingLoc} 
            suggestions={suggestions}
            setActiveSuggestion={setActiveSuggestion}
            isSearching={isSearching}
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


export default AppContainer;
