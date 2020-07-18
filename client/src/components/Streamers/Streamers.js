import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Streamers.scss";

const Streamers = (props) => {
    let { user, streamers, width, dateDifference, showLogin, showSearch } = props;

    if (!user) {
        return (
            <div className="wrap">
                <div className="unauth">
                    <FontAwesomeIcon className="icon" icon="user-circle" size="10x" />
                    <p>Sign In to see followed streamers.</p>
                    <button onClick={showLogin}>SIGN IN</button>
                </div>
            </div>
        );
    }
    if (!streamers.length) {
        return (
            <div className="wrap">
                <div className="unauth">
                    <FontAwesomeIcon className="icon" icon="user-plus" size="10x" />
                    <p>Search and follow you favourite streamers</p>
                    <button onClick={showSearch}>SEARCH STREAMERS </button>
                </div>
            </div>
        );
    }
    return (
        <div className="followed">
            {streamers.map((streamer) => (
                <Link to={"/streamer/" + streamer["name"]} key={streamer["name"]} className="followed-streamer ">
                    <img src={streamer["logo"]} width="100" height="100" alt="MISSING" />

                    {width < 500 ? (
                        <div className="minimized">
                            <p>{streamer.display_name}</p>

                            <div className="status">
                                {streamer.live ? <p className="indicator">LIVE</p> : <p>OFFLINE</p>}
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>{streamer.display_name}</p>
                            <div className="status gap">
                                {streamer.live ? <p className="indicator">LIVE</p> : <p>OFFLINE</p>}
                            </div>
                        </>
                    )}
                    <div className="time-since">
                        Followed: <span>{dateDifference(new Date(streamer["followed_at"]), new Date())}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Streamers;
