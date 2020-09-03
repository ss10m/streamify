import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin, hideSearch } from "store/actions.js";

import "./Streamer.scss";

import StreamerDetails from "./components/StreamerDetails/StreamerDetails";
import RecentGames from "./components/RecentGames/RecentGamesContainer";
import StreamerView from "./components/StreamerView/StreamerViewContainer";

const Streamer = (props) => {
    let {
        session,
        showLogin,
        showSearchGames,
        windowSize,
        streamer,
        handleFollowChange,
        toggleFollowPrompt,
    } = props;

    return (
        <div className="streamer">
            <StreamerDetails
                streamer={streamer}
                handleFollowChange={handleFollowChange}
            />

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
