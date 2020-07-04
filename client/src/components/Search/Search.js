import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { hideSearch } from "../../store/actions";

import Spinner from "../Spinner/Spinner";

import "./Search.scss";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = { searchInput: "", results: [], noResults: false, time: Date.now(), width: window.innerWidth };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

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
        if (type === "user") {
            body = JSON.stringify({ query, type });
        } else {
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
                if (data.data.length === 0) {
                    return this.setState({ noResults: true });
                }
                return this.setState({ results: data.data, noResults: false });
            }
            console.log(data.message || "Something went wrong.");
        } catch (err) {
            console.log("Something went wrong.");
        }
    };

    closeSearch = () => {
        this.props.hideSearch();
    };

    getHeader = () => {
        let { type, user } = this.props.mode;

        if (type === "user") {
            return (
                <div className="title">
                    <p>SEARCH </p>
                </div>
            );
        }
        return (
            <div className="title games">
                <p>SEARCH GAMES FOR</p>
                <div>
                    <img src={user["logo"]} width="30" height="30" alt="MISSING" />
                    <p>{user.display_name}</p>
                </div>
            </div>
        );
    };

    getResults = () => {
        let { searchInput, results, time, noResults } = this.state;
        let { type, user } = this.props.mode;

        if (noResults) return <p style={{ marginLeft: "10px" }}>No matches found</p>;
        if (searchInput && results.length === 0) {
            return <Spinner />;
        }

        if (type === "user") {
            return results.map((result) => (
                <Link
                    to={"/streamer/" + result.display_name}
                    key={result.id}
                    className="result"
                    onClick={this.props.hideSearch}
                >
                    <img src={result["thumbnail_url"]} width="80" height="80" alt="MISSING" />
                    {this.getStatus(result, time)}
                </Link>
            ));
        } else {
            return <p style={{ marginLeft: "10px" }}>NO GAMES</p>;
        }
    };

    getStatus = (result, time) => {
        if (window.innerWidth > 500) {
            return (
                <>
                    <p>{result.display_name.toUpperCase()}</p>

                    <div className="status">
                        {result.is_live ? (
                            <>
                                <p className="indicator">LIVE</p>
                                <p className="time">{dateDifference(new Date(result.started_at), time)}</p>
                            </>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </>
            );
        } else {
            return (
                <div className="mini">
                    <p>{result.display_name.toUpperCase()}</p>
                    <div className="status">
                        {result.is_live ? (
                            <>
                                <p className="indicator">LIVE</p>
                                <p className="time">{dateDifference(new Date(result.started_at), time)}</p>
                            </>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </div>
            );
        }
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

const mapDispatchToProps = (dispatch) => ({
    hideSearch: () => {
        dispatch(hideSearch());
    },
});

const dateDifference = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);

    if (delta_m < 10) delta_m = "0" + delta_m;
    if (delta_s < 10) delta_s = "0" + delta_s;

    return `${delta_h}:${delta_m}:${delta_s}`;
};

export default withRouter(connect(null, mapDispatchToProps)(Search));
