// Libraries & utils
import React from "react";

// Components
import StreamerDetails from "./components/StreamerDetails/StreamerDetails";
import RecentGames from "./components/RecentGames/RecentGamesContainer";
import StreamerView from "./components/StreamerView/StreamerViewContainer";

// SCSS
import "./Streamer.scss";

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

export default Streamer;
