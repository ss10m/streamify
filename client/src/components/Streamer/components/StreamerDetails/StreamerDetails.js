import React from "react";

import { dateDifference } from "helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { FOLLOW_STREAMER, UNFOLLOW_STREAMER } from "helpers";

import "./StreamerDetails.scss";

const StreamerDetails = (props) => {
    return (
        <div className="tops">
            <Logo streamer={props.streamer} />
            <StreamInfo {...props} />
        </div>
    );
};

const Logo = ({ streamer }) => {
    return (
        <div className="img-wrapper">
            <img src={streamer["logo"]} width="200" height="200" alt="MISING" />
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
    );
};

const StreamInfo = (props) => {
    let { streamer } = props;
    return (
        <div className="info">
            <div className="streamer-name">{streamer["display_name"]}</div>
            {streamer.stream && (
                <div className="small-info">
                    {"Playing " + streamer.stream.game}
                </div>
            )}

            <div className="small-info follow-age">
                {streamer.following
                    ? "Followed " +
                      dateDifference(new Date(streamer.followed_at), new Date())
                    : ""}
            </div>
            <FollowButton {...props} />
        </div>
    );
};

const FollowButton = ({ streamer, handleFollowChange }) => {
    let button;
    if (streamer.following) {
        button = (
            <button
                className="unfollow"
                onClick={() => handleFollowChange(UNFOLLOW_STREAMER)}
            >
                UNFOLLOW
            </button>
        );
    } else {
        button = (
            <button onClick={() => handleFollowChange(FOLLOW_STREAMER)}>
                FOLLOW
            </button>
        );
    }
    return <div className="follow">{button}</div>;
};

export default StreamerDetails;
