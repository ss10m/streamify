import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactDOM from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UserOptions.scss";

class UserOptions extends Component {
    constructor(props) {
        super(props);
        this.state = { showNotifications: true, time: Date.now() };
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
        clearInterval(this.interval);
    }

    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.toggleDropDown(event);
        }
    };

    logout = () => {
        this.props.logout();
        this.props.toggleDropDown();
    };

    toggleNotifications = (event) => {
        this.setState({ showNotifications: event.target.checked });
    };

    render() {
        let { username, last_login } = this.props.user;
        let loggedIn = dateDifference(new Date(last_login), this.state.time);

        return (
            <div className="dropdown-options">
                <div className="top">
                    <div className="info">
                        <FontAwesomeIcon className="user-icon" icon="user" size="3x" />
                        <p className="username">{username}</p>
                    </div>
                    <p className="last-login">Logged in: {loggedIn}</p>
                </div>
                <hr className="divider" />

                <div className="option">
                    <a className="button selectable" type="button">
                        <FontAwesomeIcon className="option-icon" icon="cog" size="2x" />
                        Settings
                    </a>
                </div>
                <div className="option">
                    <a className="button selectable" type="button">
                        <FontAwesomeIcon className="option-icon" icon="globe-americas" size="2x" />
                        Language
                    </a>
                </div>
                <div className="option">
                    <a className="button" type="button" style={{ cursor: "default" }}>
                        <FontAwesomeIcon className="option-icon" icon="bell" size="2x" />
                        Notifications
                        <input
                            type="checkbox"
                            checked={this.state.showNotifications}
                            style={{ marginLeft: "30px" }}
                            onChange={this.toggleNotifications}
                        />
                    </a>
                </div>

                <hr className="divider" />
                <div className="option">
                    <a className="button selectable" type="button" onClick={this.logout}>
                        <FontAwesomeIcon className="option-icon" icon="sign-out-alt" size="2x" />
                        Log Out
                    </a>
                </div>
            </div>
        );
    }
}

const dateDifference = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);
    offset /= 24;
    let delta_d = parseInt(offset);

    if (delta_d > 365) {
        let years = parseInt(delta_d / 365);
        let plural = years > 1 ? "s" : "";
        return `${years} year${plural} ago`;
    }
    if (delta_d > 30) {
        let months = parseInt(delta_d / 30);
        let plural = months > 1 ? "s" : "";
        return `${months} month${plural} ago`;
    }
    if (delta_d > 0) {
        let plural = delta_d > 1 ? "s" : "";
        return `${delta_d} day${plural} ago`;
    }
    if (delta_h > 0) {
        let plural = delta_h > 1 ? "s" : "";
        return `${delta_h} hour${plural} ago`;
    }
    if (delta_m > 0) {
        let plural = delta_m > 1 ? "s" : "";
        return `${delta_m} minute${plural} ago`;
    }
    if (delta_s > 10) {
        return `${delta_s} seconds ago`;
    } else {
        return "just now";
    }
};

export default withRouter(UserOptions);
