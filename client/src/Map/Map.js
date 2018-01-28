import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-easybutton';

import 'bulma/css/bulma.css';
import './Map.css';


const markerIcon = L.icon({
    iconUrl: './images/map-markers/marker-icon.png',
    shadowUrl: './images/map-markers/marker-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});

const markerSecIcon = L.icon({
    iconUrl: './images/map-markers/marker-sec-icon.png',
    shadowUrl: './images/map-markers/marker-sec-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});


function createPopupContent( suggestion, handlers ) {
    const card = L.DomUtil.create('div', 'card');
    const cardImage = L.DomUtil.create('div', 'card-image', card );
    const figure = L.DomUtil.create('figure', 'image is-3by2', cardImage );
    const img = L.DomUtil.create('img', 'popupImage', figure );
    img.src = suggestion.image_url;
    img.alt = 'Placeholder text';

    const cardContent = L.DomUtil.create('div', 'card-content', card );
    const media = L.DomUtil.create('div', 'media', cardContent );
    const mediaContent = L.DomUtil.create('div', 'media-content', media);
    const title = L.DomUtil.create('div', 'title is-4', mediaContent );
    title.innerHTML = suggestion.name;
    const subtitle = L.DomUtil.create('div', 'subtitle is-6', mediaContent );
    subtitle.innerHTML = suggestion.phone;

    const content = L.DomUtil.create('div', 'content', cardContent );
    suggestion.location.display_address.forEach( (addr) => {
        const addrContainer = L.DomUtil.create('div', '', content )
        addrContainer.innerHTML = addr;
    });
    L.DomUtil.create('br', '', content );
    const rating = L.DomUtil.create('div', '', content );
    rating.innerHTML = `Rating: ${suggestion.rating}/5`;

    const buttonContainer = L.DomUtil.create('div', 'button-container has-text-centered', cardContent );
    var addButton = L.DomUtil.create('button', 'button is-link', buttonContainer);
    addButton.setAttribute('type', 'button');
    addButton.innerHTML = 'Details & Add';

    if( handlers.onClick ) L.DomEvent.on(addButton, 'click', handlers.onClick );

    return card;
}


export default class MapContainer extends Component {

    render() {
        const { locs, locHelpers, suggestions, setActiveSuggestion, isSearching } = this.props;
        /* if (!locs.length) return <div>Error loading map. No initial location.</div> */
        return <Map 
        locs={locs} 
        locHelpers={locHelpers} 
        suggestions={suggestions} 
        setActiveSuggestion={setActiveSuggestion}
        isSearching={isSearching}
        />
    }
}


/**
 * This component is wierd/wrong because Leaflet methods manipulate the DOM too.
 * So it ends up being an hybrid between React and Leaflet (surely losing performance).
 */

class Map extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: undefined,
            markerLayers: [],
            floatingMarker: undefined,
            suggestionsMarkers: [],
        }
    }

    componentDidMount() {
        this.createMap();
    }

    componentWillReceiveProps(nextProps) {
        const { map, markerLayers, floatingMarker, suggestionsMarkers } = this.state;
        const { suggestions, setActiveSuggestion, isSearching } = nextProps;
        if (!map) return;

        const { locs: newLocs, floatingLoc } = nextProps;
        const oldLocs = markerLayers.map( (markLayer) => {
            const objLoc = markLayer.getLatLng();
            return [ objLoc.lat, objLoc.lng ];
        } );

        const toRemoveFlags = oldLocs.map( (oldLoc, i) => !newLocs.some( (newLoc) => {
            return newLoc[0]===oldLoc[0] && newLoc[1]===oldLoc[1];
        }));
        const toAdd = newLocs.filter( (newLoc) => oldLocs.every( (oldLoc) => {
            return oldLoc[0]!==newLoc[0] && oldLoc[1]!==newLoc[1];
        }));

        if(toAdd.length) map.panTo(toAdd[0]);
        /*
        //Add new markers
        const newMarkers = toAdd.map( (e) =>  L.marker(e, {icon: markerIcon}) );
        newMarkers.forEach( (newMarker) => newMarker.addTo(map));

        //Zooms to new marker/s
        if( newMarkers.some( (marker) => !map.getBounds().contains(marker.getLatLng()) )) {
            const group = new L.featureGroup( newMarkers);
            map.fitBounds(group.getBounds().pad(0.25));
        }
        
        this.setState({
            markerLayers: [ ...markerLayers, ...newMarkers ]
        });
        */

        //Remove markers
        toRemoveFlags.forEach( (e,i) => {
            if( !e ) return;
            const targetLayer = markerLayers.find( (markerLayer) => {
                const objLoc = markerLayer.getLatLng();
                return oldLocs[i][0]===objLoc.lat && oldLocs[i][1]===objLoc.lng 
            } );
            map.removeLayer(targetLayer);
            const newMarkersLayers = [ ...markerLayers]
            newMarkersLayers.splice(i, 1);
            this.setState({
                markerLayers: newMarkersLayers
            })
        } ); 

        //Remove floating marker
        if(!floatingLoc && floatingMarker) {
            map.removeLayer(floatingMarker);
            this.setState({
                floatingMarker: undefined
            })
        }

        //Suggestions
        suggestionsMarkers.forEach( (suggestionMarker) => map.removeLayer(suggestionMarker) );
        const suggsMarkers = suggestions.map( (suggestion) => {
            const { coordinates: coords } = suggestion;
            const marker = L.marker([coords.latitude, coords.longitude], {icon: markerIcon});
            
            const popUp = L.popup({
                autoPan: false
            });
            popUp.setContent( createPopupContent(suggestion, {
                onClick: () => {
                    setActiveSuggestion(suggestion);
                }
            }) );

            marker.bindPopup(popUp);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.on('click', function(e) {
                this.off('mouseover');
                this.off('mouseout');
                this.openPopup();
            });
            marker.on('popupclose', function(e) {
                this.off('mouseover');
                this.off('mouseout');
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
            })
            return marker;
        });
        suggsMarkers.forEach( (suggMarker) => suggMarker.addTo(map) );
        if( suggsMarkers.length ) {
            let group = new L.featureGroup( suggsMarkers );
            map.fitBounds(group.getBounds().pad(0.25));
        }
        this.setState({
            suggestionsMarkers: suggsMarkers
        });

        // Loading cursor
        if(isSearching) {
            L.DomUtil.addClass(map._container,'mapIsSearching');
        }
        else {
            L.DomUtil.removeClass(map._container,'mapIsSearching');
        }

    }


    createMap() {
        const { locs, locHelpers } = this.props;
        const map = L.map('mapid').setView( locs[0] || [-31.405633, -64.191981], 12);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 17
        }).addTo(map);
        const markerLayers = locs.map( (loc) => L.marker(loc, {icon: markerIcon}) );
        markerLayers.forEach( (markerLayer) => markerLayer.addTo(map) );
        
        map.on('click', (e) => {
            const { floatingMarker, map } = this.state;
            if ( floatingMarker ) {
                map.removeLayer(floatingMarker);
                locHelpers.setFloater(undefined)
                this.setState({
                    floatingMarker: undefined
                });
            }
            else {
                const marker = new L.marker(e.latlng, { icon: markerSecIcon }).addTo(map);
                
                locHelpers.setFloater([e.latlng.lat, e.latlng.lng]);
                this.setState({
                    floatingMarker: marker
                });
            }
        });

        L.easyButton('<span class="star">&starf;</span>', (btn, map) => {
            const { suggestionsMarkers } = this.state;
            if( !suggestionsMarkers.length ) return;
            const group = new L.featureGroup(suggestionsMarkers);
            map.fitBounds(group.getBounds().pad(0.1));
        }).addTo( map );

        this.setState({
            map: map,
            markerLayers: markerLayers
        });
    }

    addMarker(loc) {
        const { markerLayers, map } = this.state;

        const newMarker = L.marker(loc, {icon: markerIcon}).addTo(map);
        const newMarkers = [ ...markerLayers, newMarker ];

        //Zoom to fit every marker after adding
        if( newMarkers.some( (marker) => !map.getBounds().contains(marker.getLatLng()) )) {
            const group = new L.featureGroup( newMarkers);
            map.fitBounds(group.getBounds().pad(0.1));
        }

        this.setState({
            markerLayers: newMarkers,
            floatingMarker: undefined
        });
    }

    render() {
        const { isSearching } = this.props;
        
        return (
            <div className={`mapContainer ${isSearching ? 'mapIsSearching' : ''}`}>
                <div id="mapid" ></div>
            </div>
        )
    }
}
