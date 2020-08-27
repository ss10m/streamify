import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin } from "store/actions.js";

import { dateDifference } from "helpers";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Streamer.scss";
import Spinner from "../Spinner/Spinner";
import FollowModal from "./FollowModal";
import RecentGames from "./components/RecentGames/RecentGamesContainer";
import StreamerView from "./components/StreamerView/StreamerViewContainer";

const FOLLOW_STREAMER = "FOLLOW_STREAMER";
const UNFOLLOW_STREAMER = "UNFOLLOW_STREAMER";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";
const LOGIN = "LOGIN";

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streamer: null,
            showFollowPrompt: false,
        };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({
                streamer: null,
                direction: null,
                seat: 0,
                recent_games: [],
                showFollowPrompt: false,
                previewLoaded: false,
            });
            this.getStreamersData();
        }
        if (this.props.session !== prevProps.session) {
            let {
                session: { user },
            } = this.props;
            if (user) {
                this.getStreamersData();
            } else {
                let streamer = this.state.streamer;
                streamer.following = false;
                streamer.followed_games = [];
                this.setState({ streamer });
            }
        }
    }

    getStreamersData = () => {
        fetch("/api/twitchify/streamer/" + this.props.match.params.id, {})
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((data) => {
                this.setState({ streamer: data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    parseGame = (game) => {
        return { id: game.id, name: game.name, box_art_url: game.box_art_url };
    };

    handleFollowChange = async (action, data = {}) => {
        if (action === FOLLOW_GAME || FOLLOW_GAME === UNFOLLOW_GAME) {
            data = this.parseGame(data);
        }
        data.username = this.props.match.params.id;
        const response = await fetch("/api/twitchify/follow", {
            method: "POST",
            body: JSON.stringify({ action, data }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        try {
            let data = await response.json();
            if (!response.ok) throw data;

            let streamer = this.state.streamer;
            switch (action) {
                case FOLLOW_STREAMER:
                    streamer.following = true;
                    streamer.followed_at = new Date().getTime() - 5000;

                    break;
                case UNFOLLOW_STREAMER:
                    streamer.following = false;
                    streamer.followed_games = [];
                    break;
                case FOLLOW_GAME:
                    streamer.followed_games = [...data];
                    break;
                case UNFOLLOW_GAME:
                    streamer.followed_games = [...data];
                    break;
                default:
                    return;
            }
            this.setState({ streamer });
        } catch (err) {
            console.log(err);
            if (!err.action) return this.getStreamersData();

            switch (err.action) {
                case LOGIN:
                    return this.props.showLogin();
                case FOLLOW_STREAMER:
                    return this.toggleFollowPrompt();
                default:
                    return;
            }
        }
    };

    toggleFollowPrompt = () => {
        this.setState((prevState) => ({
            showFollowPrompt: !prevState.showFollowPrompt,
        }));
    };

    handleFollow = () => {
        this.handleFollowChange(FOLLOW_STREAMER);
        this.setState({ showFollowPrompt: false });
    };

    render() {
        let { streamer, showFollowPrompt } = this.state;
        let { session, showLogin, showSearchGames, windowSize } = this.props;

        if (!streamer) {
            return <Spinner />;
        }

        console.log(streamer);

        let button = (
            <button onClick={() => this.handleFollowChange(FOLLOW_STREAMER)}>
                FOLLOW
            </button>
        );
        if (streamer.following)
            button = (
                <button
                    className="unfollow"
                    onClick={() => this.handleFollowChange(UNFOLLOW_STREAMER)}
                >
                    UNFOLLOW
                </button>
            );

        return (
            <>
                {showFollowPrompt && (
                    <div className="follow-prompt">
                        <FollowModal
                            streamer={streamer}
                            follow={this.handleFollow}
                            close={this.toggleFollowPrompt}
                        />
                    </div>
                )}
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
                                    <div
                                        className={
                                            streamer.stream ? "live" : ""
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon="eye"
                                            className="icon"
                                        />
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
                        handleFollowChange={this.handleFollowChange}
                    />
                    <RecentGames
                        streamer={streamer}
                        handleFollowChange={this.handleFollowChange}
                        showLogin={showLogin}
                        showSearchGames={showSearchGames}
                        showFollowPrompt={this.toggleFollowPrompt}
                        isLoggedIn={session.user}
                    />
                </div>
            </>
        );
    }
}

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
    showLogin: () => {
        dispatch(showLogin());
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Streamer)
);
