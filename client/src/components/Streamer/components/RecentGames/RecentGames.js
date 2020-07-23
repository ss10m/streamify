import React from "react";

import "./RecentGames.scss";

const RecentGames = (props) => {
    let { recentGames, searchBtn, carouselClass, followGame, handleCarousel } = props;
    return (
        <div>
            <Header searchBtn={searchBtn} />
            <div className="recent-games">
                <div className="controls left" onClick={() => handleCarousel(false)}>
                    ‹
                </div>
                <div className="list">
                    <ul className={carouselClass}>
                        <Games recentGames={recentGames} followGame={followGame} />
                    </ul>
                </div>

                <div className="controls right" onClick={() => handleCarousel(true)}>
                    ›
                </div>
            </div>
        </div>
    );
};

const Header = ({ searchBtn }) => {
    return (
        <div className="recent-games-header">
            <div className="recent-games-title">Recent Games</div>
            <button onClick={searchBtn}>Search Games</button>
        </div>
    );
};

const Games = ({ recentGames, followGame }) => {
    return recentGames.map((game) => (
        <li key={game.id} className="item" style={{ order: game.order }}>
            <div>{game.name}</div>
            <img src={game["box_art_url"]} width="200" height="300" alt="MISSING" onClick={() => followGame(game)} />
        </li>
    ));
};

export default RecentGames;
