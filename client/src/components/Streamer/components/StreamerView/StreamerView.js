// Libraries & utils
import React from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./StreamerView.scss";

// Images
import offline from "./offline.jpg";

const StreamerView = (props) => {
    let {
        streamer,
        previewLoaded,
        previewWidth,
        unfollowGame,
        onPreviewLoad,
    } = props;

    return (
        <div className="streamer-view">
            <Preview
                streamer={streamer}
                previewLoaded={previewLoaded}
                previewWidth={previewWidth}
                onPreviewLoad={onPreviewLoad}
            />
            <FollowedGames streamer={streamer} unfollowGame={unfollowGame} />
        </div>
    );
};

const Preview = ({ streamer, previewLoaded, previewWidth, onPreviewLoad }) => {
    let style = {
        width: previewWidth,
        height: previewWidth * 0.53,
    };
    return (
        <div className="stream-preview" style={style}>
            {previewLoaded ? null : <div className="loading" style={style} />}
            <img
                src={streamer.preview || offline}
                alt="MISING"
                style={previewLoaded ? style : null}
                onLoad={onPreviewLoad}
            />
            {streamer.stream && (
                <div
                    className="icon"
                    onClick={() => {
                        window.open(
                            `https://www.twitch.tv/${streamer.name}`,
                            "_blank"
                        );
                    }}
                >
                    <FontAwesomeIcon icon="play" size="4x" />
                </div>
            )}
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
                            <div
                                className="remove"
                                onClick={() => unfollowGame(game)}
                            >
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