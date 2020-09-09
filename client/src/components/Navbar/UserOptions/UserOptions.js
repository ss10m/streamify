// Libraries & utils
import React from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./UserOptions.scss";

const UserOptions = (props) => {
    let {
        username,
        loggedIn,
        showNotifications,
        toggleNotifications,
        logout,
    } = props;
    return (
        <div className="dropdown-options">
            <Header username={username} loggedIn={loggedIn} />
            <hr className="divider" />
            <Button icon="cog" name="Settings" />
            <Button icon="globe-americas" name="Language" />
            <Checkbox
                showNotifications={showNotifications}
                toggleNotifications={toggleNotifications}
            />
            <hr className="divider" />
            <Button icon="sign-out-alt" name="Log Out" onClick={logout} />
        </div>
    );
};

const Header = ({ username, loggedIn }) => {
    return (
        <div className="dropdown-header">
            <div className="info">
                <FontAwesomeIcon className="user-icon" icon="user" size="3x" />
                <p className="username">{username}</p>
            </div>
            <p className="last-login">Logged in: {loggedIn}</p>
        </div>
    );
};

const Button = ({ icon, name, onClick }) => {
    return (
        <div className="dropdown-option">
            <div className="button selectable" onClick={onClick}>
                <FontAwesomeIcon
                    className="option-icon"
                    icon={icon}
                    size="2x"
                />
                {name}
            </div>
        </div>
    );
};

const Checkbox = ({ showNotifications, toggleNotifications }) => {
    return (
        <div className="dropdown-option">
            <div className="button" type="button" style={{ cursor: "default" }}>
                <FontAwesomeIcon
                    className="option-icon"
                    icon="bell"
                    size="2x"
                />
                Notifications
                <input
                    type="checkbox"
                    checked={showNotifications}
                    style={{ marginLeft: "30px" }}
                    onChange={toggleNotifications}
                />
            </div>
        </div>
    );
};
export default UserOptions;
