import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { hideSearch } from "store/actions";

import Spinner from "../Spinner/Spinner";

import "./Search.scss";
import { liveTime } from "helpers";

const SEARCH_USERS = "USERS";
const SEARCH_GAMES = "GAMES";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = { searchInput: "", results: [], noResults: false, time: Date.now() };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
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
            body = JSON.stringify({ query, type, username: user.name, id: user._id });
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
                console.log(data);
                console.log(data.length);
                if (data.length === 0) {
                    return this.setState({ noResults: true });
                }
                return this.setState({ results: data, noResults: false });
            }
            console.log(data.message || "Something went wrong.");
            this.setState({ noResults: true });
        } catch (err) {
            console.log(err);
            console.log("Something went wrong.");
        }
    };

    closeSearch = () => {
        this.props.hideSearch();
    };

    getHeader = () => {
        let { type, user } = this.props.mode;

        if (type === SEARCH_USERS) {
            return (
                <div className="title">
                    <p>SEARCH </p>
                </div>
            );
        } else if (type === SEARCH_GAMES) {
            return (
                <div className="title games">
                    <p>SEARCH GAMES FOR</p>
                    <div>
                        <img src={user["logo"]} width="30" height="30" alt="MISSING" />
                        <p>{user.display_name}</p>
                    </div>
                </div>
            );
        }
    };

    getResults = () => {
        let { searchInput, results, time, noResults } = this.state;
        //console.log(results);
        //console.log(noResults);
        let { type } = this.props.mode;

        if (noResults) return <p style={{ marginLeft: "10px" }}>No matches found</p>;
        if (searchInput && results.length === 0) {
            return <Spinner />;
        }

        if (type === SEARCH_USERS) {
            return results.map((result) => (
                <Link
                    to={"/streamer/" + result.display_name}
                    key={result.id}
                    className="result"
                    onClick={this.props.hideSearch}
                >
                    <img src={result["thumbnail_url"]} width="100" height="100" alt="MISSING" />

                    {this.userInfo(result, time)}
                </Link>
            ));
        } else if (type === SEARCH_GAMES) {
            return results.map((result) => (
                <div className="result">
                    <img src={result["box_art_url"]} width="67" height="100" alt="MISSING" />

                    {this.gameInfo(result)}
                </div>
            ));
        }
    };

    gameInfo = (result) => {
        let { handleFollowChange } = this.props.mode;
        let { windowSize } = this.props;
        let btnClass = result.following ? "unfollow" : "";
        let button = (
            <button
                className={btnClass}
                onClick={() => handleFollowChange(result.following ? UNFOLLOW_GAME : FOLLOW_GAME, result)}
            >
                {result.following ? "UNFOLLOW" : "FOLLOW"}
            </button>
        );

        return (
            <div className={"info" + (windowSize <= 500 ? " mini" : "")}>
                <div className="name center">{result.name}</div>
                <div className="options center" style={{ justifyContent: windowSize <= 500 ? "center" : "start" }}>
                    {button}
                </div>
            </div>
        );
    };

    userInfo = (result, time) => {
        return (
            <div className={"info" + (this.props.windowSize <= 500 ? " mini" : "")}>
                <div className="name center">{result.display_name.toUpperCase()}</div>
                <div className="options center">
                    <div className="status">
                        {result.is_live ? (
                            <>
                                <p className="indicator">LIVE</p>
                                <p className="time">{liveTime(new Date(result.started_at), time)}</p>
                            </>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="search-wrapper">
                <div className="search">
                    <div className="header">
                        {this.getHeader()}
                        <div className="close-btn" onClick={this.closeSearch}>
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
                            autoFocus
                        />
                    </div>
                    <div className="results">{this.getResults()}</div>
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search));
