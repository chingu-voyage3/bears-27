import React, { Component } from 'react';

import './CategoryChooser.css';


export default class CategoryChooser extends Component {

    render() {
        return (
        <div id="category-chooser-container">
            <div class="control is-expanded">
                <label class="radio">
                    <input type="radio" name="answer" />
                    Bars
                </label>
                <label class="radio">
                    <input type="radio" name="answer" />
                    Food
                </label>
                <label class="radio">
                    <input type="radio" name="answer" />
                    Entertainment
                </label>
            </div>
        </div>
        )
    }
} 