import React, { Component } from "react";

import RecentGames from "./RecentGames";

const FOLLOW_GAME = "FOLLOW_GAME";

class RecentGamesContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            direction: null,
            seat: 0,
            recentGames: [],
        };
    }

    componentDidMount() {
        this.setupCarousel();
    }

    setupCarousel = () => {
        let recentGames = [...this.props.streamer.recent_games];

        for (let i = 0; i < recentGames.length - 1; i++) {
            recentGames[i].order = i + 2;
            recentGames[i].next = recentGames[i + 1];
        }
        recentGames[recentGames.length - 1].order = 1;
        recentGames[recentGames.length - 1].next = recentGames[0];

        this.setState({ direction: null, recentGames, seat: recentGames.length - 1 });
    };

    handleCarousel = (moveRight) => {
        let { recentGames, seat } = this.state;

        let newSeat = 0;
        let newDirection = null;
        if (moveRight) {
            newSeat = seat + 1 >= recentGames.length ? 0 : seat + 1;
            newDirection = "right";
        } else {
            newSeat = seat - 1 < 0 ? recentGames.length - 1 : seat - 1;
            newDirection = "left";
        }

        let current = recentGames[newSeat];
        current.order = 1;

        for (let i = 1; i < recentGames.length; i++) {
            current = current.next;
            current.order = i + 1;
        }

        this.setState({ seat: newSeat, direction: newDirection });
    };

    followGame = (game) => {
        this.props.handleFollowChange(FOLLOW_GAME, game);
    };

    render() {
        let { recentGames, direction } = this.state;
        let { streamer, isLoggedIn, showSearchGames, showLogin, showFollowPrompt } = this.props;

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

        let searchBtn;
        if (!isLoggedIn) {
            searchBtn = () => showLogin();
        } else if (!streamer.following) {
            searchBtn = () => showFollowPrompt();
        } else {
            searchBtn = () => showSearchGames(streamer, this.props.handleFollowChange);
        }

        return (
            <RecentGames
                recentGames={recentGames}
                searchBtn={searchBtn}
                carouselClass={carouselClass}
                handleCarousel={this.handleCarousel}
                followGame={this.followGame}
            />
        );
    }
}

export default RecentGamesContainer;
