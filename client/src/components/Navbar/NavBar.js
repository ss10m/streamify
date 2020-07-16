import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getSession, logout, showLogin, toggleNavBar, showSearch } from "../../store/actions.js";

import "./NavBar.scss";

import ExtendedBar from "./ExtendedBar";
import UserOptions from "./UserOptions";
import Notifications from "./Notifications";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { width: window.innerWidth, userOptions: false, showNotifications: false };
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        if (this.props.expandedNavbar && window.innerWidth >= 650) this.props.toggleNavBar();
        this.setState({ width: window.innerWidth });
    };

    toggleDropDown = (event) => {
        if (event) event.stopPropagation();
        let userOptions = !this.state.userOptions;
        this.setState({ userOptions });
    };

    toggleNotifications = (event) => {
        event.stopPropagation();
        this.setState((prevState) => ({
            showNotifications: !prevState.showNotifications,
        }));
    };

    showSearch = () => {
        console.log("show search");
        this.props.showSearch();
    };

    getUserBtns = (user) => {
        if (!user) {
            return (
                <div>
                    <div className="user-btn wide flex">
                        <a onClick={this.props.showLogin}>Sign In</a>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="user-btn flex" id="notifications">
                    <FontAwesomeIcon className="icon" icon="bell" size="2x" onClick={this.toggleNotifications} />
                    {this.state.showNotifications && <Notifications toggleNotifications={this.toggleNotifications} />}
                </div>
                <div className="user-btn flex" id="userDropdown">
                    <FontAwesomeIcon className="icon" icon="user-circle" size="2x" onClick={this.toggleDropDown} />
                    {this.state.userOptions && (
                        <UserOptions user={user} logout={this.props.logout} toggleDropDown={this.toggleDropDown} />
                    )}
                </div>
            </div>
        );
    };

    getSearchField = () => {
        return (
            <div className="input-wrap">
                <div className="input" onClick={this.showSearch}>
                    <div className="icon">
                        <FontAwesomeIcon icon="search" size="1x" />
                    </div>
                    <div className="input">Search</div>
                </div>
            </div>
        );
    };

    render() {
        let user = this.props.session.user;

        let extended = this.props.expandedNavbar ? " navExpanded" : "";

        return (
            <div className={"navbar" + extended}>
                <div className="top">
                    <div>
                        {this.state.width < 650 && (
                            <div className="user-btn flex">
                                <FontAwesomeIcon
                                    icon="bars"
                                    size="2x"
                                    className="bars"
                                    onClick={() => this.props.toggleNavBar()}
                                />
                            </div>
                        )}
                        <Link to="/" className="title">
                            STREAMIFY
                        </Link>
                        {this.state.width >= 650 && (
                            <>
                                <hr />
                                <Link to="/streamers" className="followed-link">
                                    FOLLOWED
                                </Link>
                            </>
                        )}
                    </div>

                    {this.state.width >= 650 && this.getSearchField()}
                    {this.getUserBtns(user)}
                </div>
                {extended && (
                    <div className="bottom">
                        <ExtendedBar {...this.props} />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        loginDisplayed: state.loginDisplayed,
        expandedNavbar: state.toggleNavbar,
        userOptions: state.userOptions,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSession: () => {
        dispatch(getSession());
    },
    logout: () => {
        dispatch(logout());
    },
    showLogin: () => {
        dispatch(showLogin());
    },
    toggleNavBar: () => {
        dispatch(toggleNavBar());
    },
    showSearch: () => {
        dispatch(showSearch());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
