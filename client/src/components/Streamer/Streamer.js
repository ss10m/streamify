import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./Streamer.scss";

class Streamer extends Component {
    constructor(props) {
        super(props);

        this.state = { streamer: {}, direction: null, seat: 0, recent_games: [] };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            console.log("ids dont match");
            this.getStreamersData();
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
                let recent_games = [];
                recent_games = [...data.data.recent_games];

                if (recent_games.length < 8) {
                    for (let i = recent_games.length; i < 8; i++) {
                        recent_games.push({
                            box_art_url: "https://static-cdn.jtvnw.net/ttv-static/404_boxart-200x300.jpg",
                            id: "0",
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

                this.setState({ streamer: data.data, direction: null, recent_games, seat: recent_games.length - 1 });
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

    getData = () => {
        let { recent_games, direction } = this.state;

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
            <>
                <div className="recent-games">
                    <a role="button" onClick={() => this.handleCarousel(false)}>
                        ‹
                    </a>
                    <div className="list">
                        <ul className={carouselClass}>
                            {recent_games.map((streamer) => (
                                <li key={streamer.name} className="item" style={{ order: streamer.order }}>
                                    <p>{streamer.name}</p>
                                    <img src={streamer["box_art_url"]} width="200" height="300" alt="MISSING" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <a role="button" onClick={() => this.handleCarousel(true)}>
                        ›
                    </a>
                </div>
            </>
        );
    };

    follow = () => {
        fetch("/api/twitchify/follow", {
            method: "POST",
            body: JSON.stringify({ username: this.props.match.params.id }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        let {
            session: { user },
        } = this.props;

        let { streamer } = this.state;

        return (
            <>
                <div className="streamer">
                    <div className="tops">
                        <img src={streamer["logo"]} width="200" height="200" alt="MISSING" />
                        <p>{streamer["display_name"]}</p>
                    </div>
                    <div>
                        <button onClick={this.follow}>FOLLOW</button>
                    </div>

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

export default withRouter(connect(mapStateToProps)(Streamer));
