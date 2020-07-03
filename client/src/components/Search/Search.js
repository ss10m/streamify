import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { hideSearch } from "../../store/actions";

import Spinner from "../Spinner/Spinner";

import "./Search.scss";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = { searchInput: "", results: [] };
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

    closeSearch = () => {
        this.props.hideSearch();
    };

    getResults = () => {
        let { searchInput, results } = this.state;
        if (searchInput && results.length === 0) {
            return (
                <div className="results">
                    <Spinner />
                </div>
            );
        }
        return <div className="results"></div>;
    };

    render() {
        return (
            <div className="search-wrapper">
                <div className="search">
                    <div className="header">
                        <p>SEARCH </p>
                        <div onClick={this.closeSearch}>
                            <FontAwesomeIcon icon="times" size="2x" />
                        </div>
                    </div>

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

                    {this.getResults()}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    hideSearch: () => {
        dispatch(hideSearch());
    },
});

export default withRouter(connect(null, mapDispatchToProps)(Search));
