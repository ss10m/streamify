import React, { Component } from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateDifference } from "helpers";

import { logout } from "store/actions.js";

import "./UserOptions.scss";

class UserOptions extends Component {
    constructor(props) {
        super(props);
        this.state = { showNotifications: true, time: Date.now() };
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
        this.interval = setInterval(
            () => this.setState({ time: Date.now() }),
            1000
        );
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
        let { username, last_login } = this.props.session.user;
        let loggedIn = dateDifference(new Date(last_login), this.state.time);

        return (
            <div className="dropdown-options">
                <div className="top">
                    <div className="info">
                        <FontAwesomeIcon
                            className="user-icon"
                            icon="user"
                            size="3x"
                        />
                        <p className="username">{username}</p>
                    </div>
                    <p className="last-login">Logged in: {loggedIn}</p>
                </div>
                <hr className="divider" />

                <div className="option">
                    <div className="button selectable">
                        <FontAwesomeIcon
                            className="option-icon"
                            icon="cog"
                            size="2x"
                        />
                        Settings
                    </div>
                </div>
                <div className="option">
                    <div className="button selectable" type="button">
                        <FontAwesomeIcon
                            className="option-icon"
                            icon="globe-americas"
                            size="2x"
                        />
                        Language
                    </div>
                </div>
                <div className="option">
                    <div
                        className="button"
                        type="button"
                        style={{ cursor: "default" }}
                    >
                        <FontAwesomeIcon
                            className="option-icon"
                            icon="bell"
                            size="2x"
                        />
                        Notifications
                        <input
                            type="checkbox"
                            checked={this.state.showNotifications}
                            style={{ marginLeft: "30px" }}
                            onChange={this.toggleNotifications}
                        />
                    </div>
                </div>

                <hr className="divider" />
                <div className="option">
                    <div
                        className="button selectable"
                        type="button"
                        onClick={this.logout}
                    >
                        <FontAwesomeIcon
                            className="option-icon"
                            icon="sign-out-alt"
                            size="2x"
                        />
                        Log Out
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
    };
};

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch(logout());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserOptions);
