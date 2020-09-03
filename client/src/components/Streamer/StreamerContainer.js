import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin, hideSearch } from "store/actions.js";

import { parseResponse } from "helpers";

import Streamer from "./Streamer";

import "./Streamer.scss";
import Spinner from "../Spinner/Spinner";
import FollowModal from "./components/FollowModal/FollowModal";

import {
    LOGIN,
    FOLLOW_STREAMER,
    UNFOLLOW_STREAMER,
    FOLLOW_GAME,
    UNFOLLOW_GAME,
} from "helpers";

class StreamerContainer extends Component {
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

    getStreamersData = async () => {
        const url = "/api/twitchify/streamer/" + this.props.match.params.id;
        const response = await fetch(url, { method: "GET" });
        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;
        if (!meta.ok) return this.props.history.push("/");
        this.setState({ streamer: data.streamer });
    };

    parseGame = (game) => {
        return { id: game.id, name: game.name, box_art_url: game.box_art_url };
    };

    handleFollowChange = async (action, data = {}) => {
        if (action === FOLLOW_GAME || action === UNFOLLOW_GAME) {
            data = this.parseGame(data);
            this.props.hideSearch();
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

            let streamer = { ...this.state.streamer };
            switch (action) {
                case FOLLOW_STREAMER:
                    streamer.following = true;
                    streamer.followed_at = new Date().getTime() - 5000;

                    break;
                case UNFOLLOW_STREAMER:
                    streamer.following = false;
                    streamer.followed_at = null;
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

        return (
            <>
                {showFollowPrompt && (
                    <FollowModal
                        streamer={streamer}
                        follow={this.handleFollow}
                        close={this.toggleFollowPrompt}
                    />
                )}
                <Streamer
                    handleFollowChange={this.handleFollowChange}
                    streamer={streamer}
                    session={session}
                    showLogin={showLogin}
                    showSearchGames={showSearchGames}
                    toggleFollowPrompt={this.toggleFollowPrompt}
                    windowSize={windowSize}
                />
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
    hideSearch: () => {
        dispatch(hideSearch());
    },
    showLogin: () => {
        dispatch(showLogin());
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StreamerContainer)
);
