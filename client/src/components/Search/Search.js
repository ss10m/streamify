import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Spinner from "../Spinner/Spinner";

import "./Search.scss";
import { liveTime } from "helpers";

const SEARCH_USERS = "USERS";
const SEARCH_GAMES = "GAMES";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";

export default (props) => {
    return (
        <div className="search-wrapper">
            <div className="search">
                <div className="header">
                    <Header mode={props.mode} />
                    <div className="close-btn" onClick={props.closeSearch}>
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
                        onChange={props.handleChange}
                        autoFocus
                    />
                </div>
                <div className="results">
                    <Results {...props} />
                </div>
            </div>
        </div>
    );
};

const Header = (props) => {
    let { type, user } = props.mode;
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
                    <img
                        src={user["logo"]}
                        width="30"
                        height="30"
                        alt="MISSING"
                    />
                    <p>{user.display_name}</p>
                </div>
            </div>
        );
    }
};

const Results = (props) => {
    let {
        searchInput,
        results,
        time,
        noResults,
        closeSearch,
        windowSize,
        liveTime,
        mode,
    } = props;

    if (noResults)
        return <p style={{ marginLeft: "10px" }}>No matches found</p>;
    if (searchInput && results.length === 0) {
        return <Spinner />;
    }

    if (mode.type === SEARCH_USERS) {
        return results.map((result) => (
            <StreamerResult
                result={result}
                time={time}
                closeSearch={closeSearch}
                windowSize={windowSize}
                liveTime={liveTime}
            />
        ));
    } else if (mode.type === SEARCH_GAMES) {
        return results.map((result) => (
            <GameResult result={result} mode={mode} windowSize={windowSize} />
        ));
    }
};

const StreamerResult = ({ result, time, closeSearch, windowSize }) => {
    return (
        <Link
            to={"/streamer/" + result.display_name}
            key={result.id}
            className="result"
            onClick={closeSearch}
        >
            <img
                src={result["thumbnail_url"]}
                width="100"
                height="100"
                alt="MISSING"
            />

            <div
                className={classNames("info", {
                    mini: windowSize <= 500,
                })}
            >
                <div className="name center">
                    {result.display_name.toUpperCase()}
                </div>
                <div className="options center">
                    <div className="status">
                        {result.is_live ? (
                            <>
                                <p className="indicator">LIVE</p>
                                <p className="time">
                                    {liveTime(
                                        new Date(result.started_at),
                                        time
                                    )}
                                </p>
                            </>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const GameResult = ({ result, mode, windowSize }) => {
    let { handleFollowChange } = mode;

    return (
        <div className="result" key={result.name}>
            <img
                src={result["box_art_url"]}
                width="67"
                height="100"
                alt="MISSING"
            />
            <div
                className={classNames("info", {
                    mini: windowSize <= 500,
                })}
            >
                <div className="name center">{result.name}</div>
                <div
                    className="options center"
                    style={{
                        justifyContent: windowSize <= 500 ? "center" : "start",
                    }}
                >
                    <button
                        className={classNames({
                            unfollow: result.following,
                        })}
                        onClick={() =>
                            handleFollowChange(
                                result.following ? UNFOLLOW_GAME : FOLLOW_GAME,
                                result
                            )
                        }
                    >
                        {result.following ? "UNFOLLOW" : "FOLLOW"}
                    </button>
                </div>
            </div>
        </div>
    );
};
