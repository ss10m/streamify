import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showSearchGames, showLogin } from "../../store/actions.js";

import "./Streamer.scss";
import Spinner from "../Spinner/Spinner";
import FollowModal from "./FollowModal";

const FOLLOW_STREAMER = "FOLLOW_STREAMER";
const UNFOLLOW_STREAMER = "UNFOLLOW_STREAMER";
const FOLLOW_GAME = "FOLLOW_GAME";
const UNFOLLOW_GAME = "UNFOLLOW_GAME";
const LOGIN = "LOGIN";

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamer: null, direction: null, seat: 0, recent_games: [], showFollowPrompt: false };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.setState({ streamer: null, direction: null, seat: 0, recent_games: [] });
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
                this.setState(streamer);
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
                console.log(data);
                let recent_games = [];
                recent_games = [...data.recent_games];

                if (recent_games.length < 8) {
                    for (let i = recent_games.length; i < 8; i++) {
                        recent_games.push({
                            box_art_url: "https://static-cdn.jtvnw.net/ttv-static/404_boxart-200x300.jpg",
                            id: i,
                            name: "Suggested " + i,
                        });
                    }
                }

                for (let i = 0; i < recent_games.length - 1; i++) {
                    recent_games[i].order = i + 2;
                    recent_games[i].next = recent_games[i + 1];
                }
                recent_games[recent_games.length - 1].order = 1;
                recent_games[recent_games.length - 1].next = recent_games[0];

                this.setState({ streamer: data, direction: null, recent_games, seat: recent_games.length - 1 });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleCarousel = (moveRight) => {
        let { recent_games, seat } = this.state;

        let newSeat = 0;
        let newDirection = null;
        if (moveRight) {
            newSeat = seat + 1 >= recent_games.length ? 0 : seat + 1;
            newDirection = "right";
        } else {
            newSeat = seat - 1 < 0 ? recent_games.length - 1 : seat - 1;
            newDirection = "left";
        }

        let current = recent_games[newSeat];
        current.order = 1;

        for (let i = 1; i < recent_games.length; i++) {
            current = current.next;
            current.order = i + 1;
        }

        this.setState({ seat: newSeat, direction: newDirection });
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
                    <p className="remove" onClick={() => this.handleFollowChange(UNFOLLOW_GAME, this.parseGame(game))}>
                        &#x2715;
                    </p>
                </div>
            );
        }

        if (!games.length) return <p>Not following any games</p>;
        return (
            <div className="followed-games">
                <p className="header">FOLLOWED GAMES</p>
                {games}
            </div>
        );
    };

    getData = () => {
        let { streamer, recent_games, direction } = this.state;

        let directionClass = "";
        if (direction === "right") {
            directionClass = " forward";
            setTimeout(() => this.setState({ direction: null }), 50);
        } else if (direction === "left") {
            directionClass = " reverse";
            setTimeout(() => this.setState({ direction: null }), 50);
        } else {
            directionClass = " reset";
        }

        let carouselClass = "items" + directionClass;

        return (
            <div>
                <div className="recent-games-header">
                    <div className="recent-games-title">Recent Games</div>
                    <button onClick={() => this.props.showSearchGames(streamer)}>Search Games</button>
                </div>
                <div className="recent-games">
                    <a role="button" onClick={() => this.handleCarousel(false)}>
                        ‹
                    </a>
                    <div className="list">
                        <ul className={carouselClass}>
                            {recent_games.map((game) => (
                                <li
                                    key={game.id}
                                    className="item"
                                    style={{ order: game.order }}
                                    onClick={() => this.handleFollowChange(FOLLOW_GAME, this.parseGame(game))}
                                >
                                    <div>{game.name}</div>
                                    <img src={game["box_art_url"]} width="200" height="300" alt="MISSING" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <a role="button" onClick={() => this.handleCarousel(true)}>
                        ›
                    </a>
                </div>
            </div>
        );
    };

    parseGame = (game) => {
        return { id: game.id, name: game.name, box_art_url: game.box_art_url };
    };

    handleFollowChange = async (action, data = {}) => {
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
        /*
        let {
            session: { user },
        } = this.props;
        */

        let { streamer, showFollowPrompt } = this.state;

        if (!streamer) {
            return <Spinner />;
        }

        let button = <button onClick={() => this.handleFollowChange(FOLLOW_STREAMER)}>FOLLOW</button>;
        if (streamer.following)
            button = <button onClick={() => this.handleFollowChange(UNFOLLOW_STREAMER)}>UNFOLLOW</button>;

        return (
            <>
                {showFollowPrompt && (
                    <div className="follow-prompt">
                        <FollowModal streamer={streamer} follow={this.handleFollow} close={this.toggleFollowPrompt} />
                    </div>
                )}
                <div className="streamer">
                    <div className="tops">
                        <img src={streamer["logo"]} width="200" height="200" alt="MISSING" />
                        <p>{streamer["display_name"]}</p>
                    </div>
                    <div className="follow">{button}</div>

                    <div>{this.getFollowedGames()}</div>

                    {this.getData()}
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
    showSearchGames: (user) => {
        dispatch(showSearchGames(user));
    },
    showLogin: () => {
        dispatch(showLogin());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Streamer));
