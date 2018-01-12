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

const MyCustomMarker = L.Marker.extend({
    bindPopup: function(htmlContent, options) {

        if (options && options.showOnMouseOver) {    
            // call the super method
            L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);
            // unbind the click event
            this.off("click", this.openPopup, this);
            // bind to mouse over
            this.on("mouseover", function(e) {
                // get the element that the mouse hovered onto
                var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
                var parent = this._getParent(target, "leaflet-popup");

                // check to see if the element is a popup, and if it is this marker's popup
                if (parent == this._popup._container) return true;
                // show the popup
                this.openPopup();
            }, this);
            
            // and mouse out
            this.on("mouseout", function(e) {
                // get the element that the mouse hovered onto
                var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;
                // check to see if the element is a popup
                if (this._getParent(target, "leaflet-popup")) {
                    L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
                    return true;
                }
                // hide the popup
                this.closePopup();
            }, this);
        }
    },

    _popupMouseOut: function(e) {
        // detach the event
        L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);
        // get the element that the mouse hovered onto
        var target = e.toElement || e.relatedTarget;
        // check to see if the element is a popup
        if (this._getParent(target, "leaflet-popup")) return true;
        // check to see if the marker was hovered back onto
        if (target == this._icon) return true;
        // hide the popup
        this.closePopup();
    },
    
    _getParent: function(element, className) {
        var parent = element.parentNode;
        while (parent != null) {
            if (parent.className && L.DomUtil.hasClass(parent, className))
                return parent;
            parent = parent.parentNode;   
        }
        return false;
    }
});



export default class MapContainer extends Component {

    render() {
        const { locs, locHelpers, suggestions } = this.props;
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
            /* const marker =  new MyCustomMarker([coords.latitude, coords.longitude], {icon: markerIcon}); */
            const marker = L.marker([coords.latitude, coords.longitude], {icon: markerIcon});
            marker.bindPopup(`
            <div class="card">
                <div class="card-image">
                    <figure class="image is-3by2">
                        <img src=${suggestion.image_url} alt="Placeholder image" />
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">${suggestion.name}</p>
                            <p class="subtitle is-6">${suggestion.phone}</p>
                        </div>
                    </div>
                
                    <div class="content">
                        ${suggestion.location.display_address.map( (addr) => 
                            `<div>${addr}</div>`
                        ).join("")}
                        <br>
                        Rating: ${suggestion.rating}/5
                    </div>
                    
                    <div>
                        <button class="button is-link" onclick="console.log('asdasd')">Add</button>
                    </div>
                </div>
            </div>
                    
            `, {
                showOnMouseOver: true
            });
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            marker.on('click', function(e) {
                this.openPopup();
                this.off('mouseover');
                this.off('mouseout');
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
        }) 

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
