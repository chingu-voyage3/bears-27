import React, { Component } from 'react';

import './CategoryChooser.css';


export default class CategoryChooser extends Component {

    onClickFactory(index) {
        const { onChange } = this.props;
        return () => {
            onChange(index);
        }
    }

    handleOnChange(val) {
        const { onChange } = this.props;
        onChange(val);
    }

    render() {
        const { current, categories } = this.props;
        if( current >= categories.length ) return <div>Error!</div>;

        console.log("CURRENT", current);

        return (
        <div id="category-chooser-container">
             { categories.map( (cat, i) => (
                <div key={i}
                className={`category-button has-text-centered ${current==i ? 'category-button-selected' :''}`}  
                onClick={this.onClickFactory(i)}
                >
                    {capitalizeFirstLetter(cat)}
                </div>
            )) }
        </div>
        )
    }
} 

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}