// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { hideSearch } from "store/actions";

// Componenets
import Search from "./Search";

// Helpers
import { liveTime } from "helpers";

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
        if (type === SEARCH_USERS) {
            body = JSON.stringify({ query, type });
        } else if (type === SEARCH_GAMES) {
            body = JSON.stringify({
                query,
                type,
                username: user.name,
                id: user._id,
            });
        }

        const response = await fetch("/api/twitchify/search", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            let data = await response.json();

            if (response.ok) {
                if (!Array.isArray(data)) data = [];
                if (data.length === 0) {
                    return this.setState({ noResults: true });
                }
                return this.setState({ results: data, noResults: false });
            }
            this.setState({ noResults: true });
        } catch (err) {
            console.log(err);
            console.log("Something went wrong.");
        }
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
