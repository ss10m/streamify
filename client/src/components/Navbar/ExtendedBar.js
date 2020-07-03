import React from "react";
import { Link } from "react-router-dom";

import "./ExtendedBar.scss";

export default (props) => {
    return (
        <div className={"extended-bar"}>
            <div>
                <Link to="/streamers" className="streamers-link" onClick={() => props.toggleNavBar()}>
                    STREAMERS
                </Link>
            </div>
        </div>
    );
};
