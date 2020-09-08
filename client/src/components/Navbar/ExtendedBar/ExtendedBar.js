// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./ExtendedBar.scss";

const ExtendedBar = (props) => {
    return (
        <div className="extended-bar">
            <Link
                to="/streamers"
                className="link"
                onClick={() => props.toggleNavBar()}
            >
                <FontAwesomeIcon icon="users" style={{ marginRight: "10px" }} />
                FOLLOWING
            </Link>

            <div
                className="link"
                onClick={() => {
                    props.toggleNavBar();
                    props.showSearch();
                }}
            >
                <FontAwesomeIcon
                    icon="search"
                    style={{ marginRight: "10px" }}
                />
                SEARCH
            </div>
        </div>
    );
};

export default ExtendedBar;
