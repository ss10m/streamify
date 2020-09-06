// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { hideSearch } from "store/actions";

// Componenets
import Search from "./Search";

// Helpers
import { liveTime, parseResponse } from "helpers";

const SEARCH_USERS = "USERS";
const SEARCH_GAMES = "GAMES";

class SearchContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            results: [],
            noResults: false,
            time: Date.now(),
        };
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ time: Date.now() }),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleChange = (event) => {
        var searchInput = event.target.value.trim();
        this.setState({ searchInput, results: [], noResults: false });
        setTimeout(() => {
            this.getNewSuggestions(searchInput);
        }, 500);
    };

    getNewSuggestions = async (query) => {
        let { type, user } = this.props.mode;
        if (query !== this.state.searchInput || query.length === 0) {
            return;
        }

        let body;
        switch (type) {
            case SEARCH_USERS:
                body = JSON.stringify({ query, type });
                break;
            case SEARCH_GAMES:
                body = JSON.stringify({
                    query,
                    type,
                    username: user.name,
                    id: user._id,
                });
                break;
            default:
                break;
        }

        const response = await fetch("/api/twitchify/search", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
            },
        });
        let parsed = await parseResponse(response);
        if (!parsed) return this.setState({ noResults: true });
        let { meta, data } = parsed;
        if (!meta.ok) return this.setState({ noResults: true });
        let results = data.result;
        if (!Array.isArray(results)) results = [];
        if (results.length === 0) {
            return this.setState({ noResults: true });
        }
        this.setState({ results: results, noResults: false });
    };

    render() {
        let { searchInput, results, time, noResults } = this.state;
        return (
            <Search
                searchInput={searchInput}
                results={results}
                time={time}
                noResults={noResults}
                mode={this.props.mode}
                closeSearch={this.props.hideSearch}
                handleChange={this.handleChange}
                getResults={this.getResults}
                windowSize={this.props.windowSize}
                liveTime={liveTime}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    hideSearch: () => {
        dispatch(hideSearch());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
