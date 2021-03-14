// Libraries & utils
import React from "react";

// SCSS
import "./RecentGames.scss";

const RecentGames = (props) => {
    let { recentGames, searchBtn, carouselClass, followGame, handleCarousel } = props;
    return (
        <div>
            <Header searchBtn={searchBtn} />
            <div className="recent-games">
                <div className="bg" />
                <div
                    className="recent-games-controls left"
                    onClick={() => handleCarousel(false)}
                >
                    ‹
                </div>
                <div className="list">
                    <ul className={carouselClass}>
                        <Games recentGames={recentGames} followGame={followGame} />
                    </ul>
                </div>

                <div
                    className="recent-games-controls right"
                    onClick={() => handleCarousel(true)}
                >
                    ›
                </div>
            </div>
        </div>
    );
};

const Header = ({ searchBtn }) => {
    return (
        <div className="recent-games-header">
            <div className="recent-games-title">RECENT GAMES</div>
            <button onClick={searchBtn}>Search Games</button>
        </div>
    );
};

const Games = ({ recentGames, followGame }) => {
    return recentGames.map((game, index) => (
        <li key={game.id + index} className="recent-game-item" style={{ order: game.order }}>
            <div>{game.name}</div>
            <div className="container">
                <img
                    src={game["box_art_url"]}
                    width="200"
                    height="300"
                    alt="MISSING"
                    onClick={() => followGame(game)}
                />
                {game.suggestion && (
                    <div className="overlay">
                        <p>Suggested</p>
                    </div>
                )}
            </div>
        </li>
    ));
};

export default RecentGames;
