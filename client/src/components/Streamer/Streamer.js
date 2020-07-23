import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin } from "../../store/actions.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Streamer.scss";
import Spinner from "../Spinner/Spinner";
import FollowModal from "./FollowModal";
import RecentGames from "./components/RecentGames/RecentGamesContainer";

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
            previewLoaded: false,
            width: window.innerWidth,
        };
    }

    componentDidMount() {
        this.getStreamersData();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

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

    getFollowedGames = () => {
        let {
            streamer: { followed_games },
        } = this.state;

        let games = [];
        for (let game of followed_games) {
            games.push(
                <div className="tag" key={game.id}>
                    <p className="name">{game.name}</p>
                    <p className="remove" onClick={() => this.handleFollowChange(UNFOLLOW_GAME, game)}>
                        &#x2715;
                    </p>
                </div>
            );
        }

        let header = <p>Not following any games</p>;
        if (games.length) header = <div className="header">FOLLOWED GAMES</div>;
        return (
            <div className="followed-games">
                {header}
                {games}
            </div>
        );
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
        let { streamer, showFollowPrompt, previewLoaded, width } = this.state;
        let { session, showLogin, showSearchGames } = this.props;

        if (!streamer) {
            return <Spinner />;
        }

        let button = <button onClick={() => this.handleFollowChange(FOLLOW_STREAMER)}>FOLLOW</button>;
        if (streamer.following)
            button = <button onClick={() => this.handleFollowChange(UNFOLLOW_STREAMER)}>UNFOLLOW</button>;

        let previewWidth = Math.max(280, Math.min(width - 90, 450));

        return (
            <>
                {showFollowPrompt && (
                    <div className="follow-prompt">
                        <FollowModal streamer={streamer} follow={this.handleFollow} close={this.toggleFollowPrompt} />
                    </div>
                )}
                <div className="streamer">
                    <div className="tops">
                        <img src={streamer["logo"]} width="200" height="200" alt="MISING" />
                        <p>{streamer["display_name"]}</p>
                    </div>
                    <div className="follow">{button}</div>

                    <div className="second_row">
                        <div
                            className="preview"
                            style={{
                                height: previewWidth * 0.53 + 20,
                                width: previewWidth,
                            }}
                        >
                            {previewLoaded ? null : (
                                <div
                                    className="loading"
                                    style={{
                                        height: previewWidth * 0.53,
                                        width: previewWidth,
                                    }}
                                />
                            )}
                            <img
                                src={streamer.preview}
                                alt="MISING"
                                onClick={() => {
                                    window.open(`https://www.twitch.tv/${streamer.name}`, "_blank");
                                }}
                                onLoad={() => this.setState({ previewLoaded: true })}
                            />
                            {streamer.stream && (
                                <div className="icon">
                                    <FontAwesomeIcon icon="play" size="4x" />
                                </div>
                            )}
                        </div>

                        <div>{this.getFollowedGames()}</div>
                    </div>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Streamer));
