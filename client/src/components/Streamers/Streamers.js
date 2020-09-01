// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import Spinner from "../Spinner/Spinner";

// SCSS
import "./Streamers.scss";

const Streamers = (props) => {
    let {
        user,
        streamers,
        width,
        dateDifference,
        showLogin,
        showSearch,
        loading,
    } = props;

    if (!user) {
        return (
            <div className="followed">
                <div className="unauth">
                    <FontAwesomeIcon
                        className="icon"
                        icon="user-circle"
                        size="8x"
                    />
                    <p>SIGN IN to see followed streamers</p>
                    <button onClick={showLogin}>SIGN IN</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Spinner />;
    }

    if (!streamers.length) {
        return (
            <div className="followed">
                <div className="unauth">
                    <FontAwesomeIcon
                        className="icon"
                        icon="user-plus"
                        size="8x"
                    />
                    <p>SEARCH and FOLLOW you favourite streamers</p>
                    <button onClick={showSearch}>SEARCH STREAMERS </button>
                </div>
            </div>
        );
    }

    return (
        <div className="followed">
            <div className="streamers">
                <p className="title">FOLLOWING</p>
                <StreamerList
                    streamers={streamers}
                    dateDifference={dateDifference}
                    width={width}
                ></StreamerList>
            </div>
        </div>
    );
};

const StreamerList = (props) => {
    let { streamers, dateDifference, width } = props;
    return streamers.map((streamer) => (
        <Link
            to={"/streamer/" + streamer["name"]}
            key={streamer["name"]}
            className="followed-streamer "
        >
            <img
                src={streamer["logo"]}
                width="100"
                height="100"
                alt="MISSING"
            />

            {width < 500 ? (
                <div className="minimized">
                    <p>{streamer.display_name}</p>

                    <div className="stream-status">
                        {streamer.live ? (
                            <p className="indicator">LIVE</p>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <p>{streamer.display_name}</p>
                    <div className="stream-status gap">
                        {streamer.live ? (
                            <p className="indicator">LIVE</p>
                        ) : (
                            <p>OFFLINE</p>
                        )}
                    </div>
                </>
            )}
            <div className="time-since">
                Followed:{" "}
                <span>
                    {dateDifference(
                        new Date(streamer["followed_at"]),
                        new Date()
                    )}
                </span>
            </div>
        </Link>
    ));
};

export default Streamers;
