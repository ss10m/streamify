import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./ExtendedBar.scss";

export default (props) => {
    return (
        <div className="extended-bar">
            <Link to="/streamers" className="streamers-link" onClick={() => props.toggleNavBar()}>
                <FontAwesomeIcon icon="users" style={{ marginRight: "10px" }} />
                STREAMERS
            </Link>

            <div
                className="streamers-link"
                onClick={() => {
                    props.toggleNavBar();
                    props.showSearch();
                }}
            >
                <FontAwesomeIcon icon="search" style={{ marginRight: "10px" }} />
                SEARCH
            </div>
        </div>
    );
};
