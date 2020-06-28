import React from "react";
import { Link } from "react-router-dom";

import "./ExtendedBar.scss";

import Search from "./Search";

export default (props) => {
    return (
        <div className={"extended-bar"}>
            <div>
                <Link to="/streamers" className="streamers" onClick={() => props.toggleNavBar()}>
                    STREAMERS
                </Link>
            </div>
            <Search />
        </div>
    );
};
