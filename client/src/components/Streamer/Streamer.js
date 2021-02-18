// Libraries & utils
import React from "react";

// Components
import StreamerDetails from "./components/StreamerDetails/StreamerDetails";
import RecentGames from "./components/RecentGames/RecentGamesContainer";
import StreamerView from "./components/StreamerView/StreamerViewContainer";
import Footer from "./components/Footer/Footer";

// SCSS
import "./Streamer.scss";

const Streamer = (props) => {
    let {
        session,
        showLogin,
        showSearchGames,
        streamer,
        handleFollowChange,
        toggleFollowPrompt,
    } = props;

    return (
        <div className="streamer">
            <StreamerDetails streamer={streamer} handleFollowChange={handleFollowChange} />
            <StreamerView streamer={streamer} handleFollowChange={handleFollowChange} />
            <RecentGames
                streamer={streamer}
                handleFollowChange={handleFollowChange}
                showLogin={showLogin}
                showSearchGames={showSearchGames}
                isLoggedIn={session.user}
                showFollowPrompt={toggleFollowPrompt}
            />
            <Footer streamer={streamer} />
        </div>
    );
};

export default Streamer;
