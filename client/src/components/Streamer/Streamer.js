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

    getStreamersData = (username) => {
        fetch("/api/twitchify/streamer/" + this.props.match.params.id, {})
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((data) => {
                this.setState({ streamer: data.data });

                let recent_games = data.data.recent_games;

                for (let i = 0; i < recent_games.length - 1; i++) {
                    recent_games[i].order = i + 2;
                    recent_games[i].next = recent_games[i + 1];
                }
                recent_games[recent_games.length - 1].order = 1;
                recent_games[recent_games.length - 1].next = recent_games[0];

                console.log(recent_games);
                this.setState({ streamer: data.data, recent_games, seat: recent_games.length - 1 });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getRecentGames = () => {
        if (!this.state.streamer.recent_games) return;

        return <div></div>;
    };

    handleCarousel2 = (moveRight) => {
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

        this.setState({ recent_games, seat: newSeat, direction: newDirection });
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

        console.log(recent_games);

        this.setState({ recent_games, seat: newSeat, direction: newDirection });
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
                    <ul className={carouselClass}>
                        {recent_games.map((streamer) => (
                            <li key={streamer.name} className="item" style={{ order: streamer.order }}>
                                <p>{streamer.name}</p>
                                <p>{streamer.order}</p>
                                <img src={streamer["box_art_url"]} width="200" height="300" alt="MISSING" />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="btns">
                    <button onClick={() => this.handleCarousel(false)}>&larr;</button>
                    <button onClick={() => this.handleCarousel(true)}>&rarr;</button>
                </div>
            </>
        );
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
//<div>{this.props.match.params.id}</div>
//<div>{(user && user.username) || "not logged in"}</div>
//<div>{JSON.stringify(this.state.data)}</div>

export default withRouter(connect(mapStateToProps)(Streamer));
