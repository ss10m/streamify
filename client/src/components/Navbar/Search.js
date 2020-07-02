import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Search.scss";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = { searchInput: "" };
    }

    handleChange = (event) => {
        var searchInput = event.target.value.trim();
        console.log(searchInput);
        this.setState({ searchInput });

        setTimeout(
            function () {
                this.getNewSuggestions(searchInput);
            }.bind(this),
            500
        );
    };

    getNewSuggestions = (searchInput) => {
        if (searchInput !== this.state.searchInput || searchInput.length === 0) {
            return;
        }

        console.log("FETCHING " + searchInput);
    };

    render() {
        return (
            <div className="input-wrap">
                <div className="input">
                    <div className="icon">
                        <FontAwesomeIcon icon="search" size="1x" />
                    </div>
                    <input
                        type="text"
                        spellCheck={false}
                        placeholder="Search"
                        autoComplete="off"
                        onChange={this.handleChange}
                    />
                </div>
                <div className="result-wrap">
                    <div className="results">
                        <div className="result">1</div>
                        <div className="result">3</div>
                        <div className="result">4</div>
                        <div className="result">5</div>
                        <div className="result">6</div>
                        <div className="result">7</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;
