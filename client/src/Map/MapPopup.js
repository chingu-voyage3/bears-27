import React, { Component } from 'react';


export default class MapPopup extends Component {

    handleAddLocation() {
        const { locHelpers, loc } = this.props;
        locHelpers.add(loc);
    }

    render() {
        const { loc } = this.props;
        if (!loc) return null;
        return (
            <div className="popUpContainer columns">
                <div className="popUp column is-4 is-offset-4 has-text-centered">
                    <div>{`${loc[0].toFixed(3)},${loc[1].toFixed(3)}`}</div>
                    <button onClick={this.handleAddLocation.bind(this)}  className="button is-outlined" >Add location</button>
                </div>
            </div>
        )
    }
}