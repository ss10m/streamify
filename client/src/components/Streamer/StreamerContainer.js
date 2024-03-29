// Libraries & utils
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { showSearchGames, showLogin, hideSearch } from "store/actions.js";

// Components
import Streamer from "./Streamer";
import Spinner from "../Spinner/Spinner";
import FollowModal from "./components/FollowModal/FollowModal";

// Helpers
import {
    LOGIN,
    REFRESH,
    FOLLOW_STREAMER,
    UNFOLLOW_STREAMER,
    FOLLOW_GAME,
    UNFOLLOW_GAME,
    parseResponse,
} from "helpers";

// SCSS
import "./Streamer.scss";

class StreamerContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
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
                isLoaded: false,
                streamer: null,
                showFollowPrompt: false,
            });
            this.getStreamersData();
        }
        if (this.props.session !== prevProps.session) {
            if (this.props.session.user) {
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
        this.cacheImages(data.streamer);
    };

    cacheImages = (streamer) => {
        let urls = [],
            cached = 0;
        urls.push(streamer.logo);
        if (streamer.preview) urls.push(streamer.preview);
        streamer.recent_games.forEach((game) => urls.push(game.box_art_url));
        urls.forEach((url) => {
            const image = new window.Image();
            image.src = url;
            image.onload = () => {
                cached++;
                if (cached === urls.length && streamer.name === this.props.match.params.id) {
                    this.setState({ isLoaded: true, streamer });
                }
            };
        });
    };

    parseGame = (game) => {
        return { id: game.id, name: game.name, box_art_url: game.box_art_url };
    };

    handleFollowChange = async (action, actionData = {}) => {
        if (action === FOLLOW_GAME || action === UNFOLLOW_GAME) {
            actionData = this.parseGame(actionData);
            this.props.hideSearch();
        }
        actionData.username = this.props.match.params.id;

        const response = await fetch("/api/twitchify/follow", {
            method: "POST",
            body: JSON.stringify({ action, data: actionData }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;

        if (!meta.ok) {
            if (!meta.action) return this.props.history.push("/");
            switch (meta.action) {
                case REFRESH:
                    return this.getStreamersData();
                case LOGIN:
                    return this.props.showLogin();
                case FOLLOW_STREAMER:
                    return this.toggleFollowPrompt();
                default:
                    return;
            }
        }

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
                streamer.followed_games = [...data.followedGames];
                break;
            case UNFOLLOW_GAME:
                streamer.followed_games = [...data.followedGames];
                break;
            default:
                return;
        }
        this.setState({ streamer });
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
        let { isLoaded, streamer, showFollowPrompt } = this.state;
        let { session, showLogin, showSearchGames } = this.props;

        if (!isLoaded) {
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
                />
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
    hideSearch: () => {
        dispatch(hideSearch());
    },
    showLogin: () => {
        dispatch(showLogin());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamerContainer));
