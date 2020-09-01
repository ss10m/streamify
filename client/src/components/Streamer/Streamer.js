import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin, hideSearch } from "store/actions.js";

import { dateDifference } from "helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Streamer.scss";

import RecentGames from "./components/RecentGames/RecentGamesContainer";
import StreamerView from "./components/StreamerView/StreamerViewContainer";

const FOLLOW_STREAMER = "FOLLOW_STREAMER";
const UNFOLLOW_STREAMER = "UNFOLLOW_STREAMER";

const Streamer = (props) => {
    let {
        session,
        showLogin,
        showSearchGames,
        windowSize,
        streamer,
        showFollowPrompt,
        handleFollowChange,
        toggleFollowPrompt,
    } = props;

    //console.log(streamer);

    let button = (
        <button onClick={() => handleFollowChange(FOLLOW_STREAMER)}>
            FOLLOW
        </button>
    );

    if (streamer.following)
        button = (
            <button
                className="unfollow"
                onClick={() => handleFollowChange(UNFOLLOW_STREAMER)}
            >
                UNFOLLOW
            </button>
        );

    return (
        <div className="streamer">
            <div className="tops">
                <div className="img-wrapper">
                    <img
                        src={streamer["logo"]}
                        width="200"
                        height="200"
                        alt="MISING"
                    />
                    <div>
                        {streamer.stream ? (
                            <div className={streamer.stream ? "live" : ""}>
                                <FontAwesomeIcon icon="eye" className="icon" />
                                {streamer.stream.viewers}
                            </div>
                        ) : (
                            "OFFLINE"
                        )}
                    </div>
                </div>
                <div className="info">
                    <div className="streamer-name">
                        {streamer["display_name"]}
                    </div>
                    {streamer.stream && (
                        <div className="small-info">
                            {"Playing " + streamer.stream.game}
                        </div>
                    )}

                    <div className="small-info follow-age">
                        {streamer.following
                            ? "Followed " +
                              dateDifference(
                                  new Date(streamer.followed_at),
                                  new Date()
                              )
                            : ""}
                    </div>

                    <div className="follow">{button}</div>
                </div>
            </div>

            <StreamerView
                width={windowSize}
                streamer={streamer}
                handleFollowChange={handleFollowChange}
            />
            <RecentGames
                streamer={streamer}
                handleFollowChange={handleFollowChange}
                showLogin={showLogin}
                showSearchGames={showSearchGames}
                isLoggedIn={session.user}
                showFollowPrompt={toggleFollowPrompt}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        session: state.session,
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    showSearchGames: (user, handleFollowChange) => {
        dispatch(showSearchGames(user, handleFollowChange));
    },
    hideSearch: () => {
        dispatch(hideSearch());
    },
    showLogin: () => {
        dispatch(showLogin());
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Streamer)
);
