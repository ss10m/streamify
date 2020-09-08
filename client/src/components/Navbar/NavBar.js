// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Components
import ExtendedBar from "./ExtendedBar/ExtendedBar";
import UserOptions from "./UserOptions/UserOptions";
import Notifications from "./Notifications/NotificationsContainer";

// SCSS
import "./NavBar.scss";

const NavBar = (props) => {
    let { windowSize, toggleNavBar, showSearch, extended } = props;

    return (
        <div
            className={classNames("navbar", {
                navExpanded: extended,
            })}
        >
            <div className="top">
                <NavBarButtons
                    windowSize={windowSize}
                    toggleNavBar={toggleNavBar}
                />
                {windowSize >= 650 && <SearchField showSearch={showSearch} />}
                <UserButtons {...props} />
            </div>
            {extended && (
                <div className="bottom">
                    <ExtendedBar
                        toggleNavBar={toggleNavBar}
                        showSearch={showSearch}
                    />
                </div>
            )}
        </div>
    );
};

const NavBarButtons = ({ windowSize, toggleNavBar }) => {
    return (
        <div>
            {windowSize < 650 && (
                <div className="navbar-user-btn">
                    <FontAwesomeIcon
                        icon="bars"
                        size="2x"
                        className="bars"
                        onClick={() => toggleNavBar()}
                    />
                </div>
            )}
            <Link to="/" className="title">
                STREAMIFY
            </Link>
            {windowSize >= 650 && (
                <>
                    <hr />
                    <Link to="/streamers" className="followed-link">
                        FOLLOWING
                    </Link>
                </>
            )}
        </div>
    );
};

const SearchField = ({ showSearch }) => {
    return (
        <div className="navbar-input-wrap">
            <div className="input" onClick={showSearch}>
                <div className="icon">
                    <FontAwesomeIcon icon="search" size="1x" />
                </div>
                <div className="input">Search</div>
            </div>
        </div>
    );
};

const UserButtons = (props) => {
    let {
        user,
        showNotifications,
        showUserOptions,
        notificationsIndicator,
        showLogin,
        toggleNotifications,
        toggleDropDown,
    } = props;

    if (!user) {
        return (
            <div className="navbar-user-btn wide">
                <button onClick={showLogin}>Sign In</button>
            </div>
        );
    }
    return (
        <div>
            <div className="navbar-user-btn" id="notifications">
                <FontAwesomeIcon
                    className="icon"
                    icon="bell"
                    size="2x"
                    onClick={toggleNotifications}
                ></FontAwesomeIcon>
                {notificationsIndicator > 0 && (
                    <span className="indicator"></span>
                )}
                {showNotifications && (
                    <Notifications toggleNotifications={toggleNotifications} />
                )}
            </div>
            <div className="navbar-user-btn" id="userDropdown">
                <FontAwesomeIcon
                    className="icon"
                    icon="user-circle"
                    size="2x"
                    onClick={toggleDropDown}
                />
                {showUserOptions && (
                    <UserOptions toggleDropDown={toggleDropDown} />
                )}
            </div>
        </div>
    );
};

export default NavBar;
