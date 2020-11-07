// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./TopStreamers.scss";

const TopStreamers = (props) => {
    let { isLoaded, isHidden, isMinimized, toggleSideBar, streamers } = props;

    return (
        <div
            className={classNames("top-streamers", {
                hidden: isHidden || isMinimized,
            })}
        >
            <Header
                isHidden={isHidden}
                isMinimized={isMinimized}
                toggleSideBar={toggleSideBar}
            />
            <StreamerList
                isLoaded={isLoaded}
                isHidden={isHidden}
                isMinimized={isMinimized}
                streamers={streamers}
            />
        </div>
    );
};

const Header = (props) => {
    let { isHidden, isMinimized, toggleSideBar } = props;

    if (isHidden) {
        return (
            <div className="switch">
                <p>TOP</p>
            </div>
        );
    }
    if (isMinimized) {
        return (
            <div className="switch">
                <FontAwesomeIcon
                    className="icon"
                    icon="caret-right"
                    size="2x"
                    onClick={toggleSideBar}
                />
            </div>
        );
    }
    return (
        <div className="switch expanded">
            <p>TOP STREAMERS</p>
            <FontAwesomeIcon
                className="icon"
                icon="caret-left"
                size="2x"
                onClick={toggleSideBar}
            />
        </div>
    );
};

const StreamerList = (props) => {
    let { isLoaded, isHidden, isMinimized, streamers } = props;

    if (!isLoaded) return <Loader />;

    return streamers.map((streamer) => (
        <Link
            className="top-streamer"
            to={"/streamer/" + streamer["name"]}
            key={streamer["name"]}
        >
            <div className="logo">
                <img src={streamer["logo"]} width="40" height="40" alt="MISSING" />
            </div>

            {!isHidden && !isMinimized && (
                <div className="info">
                    <div className="stream">
                        <div className="name">{streamer["display_name"]}</div>
                        <div className="viewer-count">
                            <div className="indicator"></div>
                            <div>{streamer["viewer_count"]}</div>
                        </div>
                    </div>
                    <div className="game">{streamer["game"]}</div>
                </div>
            )}
        </Link>
    ));
};

const Loader = () => {
    return (
        <div className="top-streamers-loader">
            <ul className="loader">
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
};

export default TopStreamers;
