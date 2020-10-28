// Libraries & utils
import React from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./StreamerView.scss";

// Images
import offline from "./offline.jpg";

const StreamerView = (props) => {
    let { streamer, unfollowGame } = props;

    return (
        <div className="streamer-view">
            <Preview streamer={streamer} />
            <FollowedGames streamer={streamer} unfollowGame={unfollowGame} />
        </div>
    );
};

const Preview = ({ streamer }) => {
    return (
        <div className="stream-preview">
            <div className="img-wrapper">
                <img src={streamer.preview || offline} alt="MISING" />
                {streamer.stream && (
                    <div
                        className="icon"
                        onClick={() => {
                            window.open(`https://www.twitch.tv/${streamer.name}`, "_blank");
                        }}
                    >
                        <FontAwesomeIcon icon="play" size="4x" />
                    </div>
                )}
            </div>
        </div>
    );
};

const FollowedGames = ({ streamer, unfollowGame }) => {
    return (
        <div className="followed-games">
            <div className="header">
                <p>FOLLOWED GAMES</p>
            </div>

            {!streamer.followed_games.length ? (
                <div className="empty">
                    <p>Follow games to get notified</p>
                </div>
            ) : (
                <div className="game-tags">
                    {streamer.followed_games.map((game) => (
                        <div className="tag" key={game.id}>
                            <div className="name">{game.name}</div>
                            <div className="remove" onClick={() => unfollowGame(game)}>
                                &#x2715;
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StreamerView;
