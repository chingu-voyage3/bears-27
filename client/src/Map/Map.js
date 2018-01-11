import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-easybutton';

import 'bulma/css/bulma.css';
import './Map.css';


var markerIcon = L.icon({
    iconUrl: './images/map-markers/marker-icon.png',
    shadowUrl: './images/map-markers/marker-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});

var markerSecIcon = L.icon({
    iconUrl: './images/map-markers/marker-sec-icon.png',
    shadowUrl: './images/map-markers/marker-sec-shadow.png',

    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize:  [41, 41]
});



export default class MapContainer extends Component {

    render() {
        const { locs, locHelpers, suggestions } = this.props;
        console.log(suggestions);
        /* if (!locs.length) return <div>Error loading map. No initial location.</div> */
        return <Map locs={locs} locHelpers={locHelpers} suggestions={suggestions} />
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
        const { suggestions } = nextProps;
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
            marker.bindPopup(`
                <div class="tooltipContainer">
                    <figure class="image is-128x128">
                        <img class="tooltipImage" src=${suggestion.image_url} />
                    </figure>
                    <div class="tooltipField tooltipName">${suggestion.name}</div>
                    <div class="tooltipField tooltipPhone">${suggestion.phone}</div>
                    ${suggestion.location.display_address.map( (addr) => 
                        `<div class="tooltipField tooltipAddress">${addr}</div>`
                    ).join("")}
                    <div class="tooltipField tooltipRating">${suggestion.rating}/5</div>
                </div>
            `);
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            return marker;
        });
        suggsMarkers.forEach( (suggMarker) => suggMarker.addTo(map) );
        if( suggsMarkers.length ) {
            let group = new L.featureGroup( suggsMarkers );
            map.fitBounds(group.getBounds().pad(0.25));
        }
        this.setState({
            suggestionsMarkers: suggsMarkers
        }) 

    }


    createMap() {
        const { locs, locHelpers } = this.props;
        const map = L.map('mapid').setView( locs[0] || [-31.405633, -64.191981], 12);
        L.tileLayer('https://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
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
            const { markerLayers } = this.state;
            const group = new L.featureGroup(markerLayers);
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
        
        return (
            <div className="mapContainer">
                <div id="mapid"></div>
            </div>
        )
    }
}
