import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getSession, logout, showLogin, toggleNavBar } from "../../store/actions.js";

import "./NavBar.scss";

import ExtendedBar from "./ExtendedBar";
import UserOptions from "./UserOptions";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { width: window.innerWidth, userOptions: false };
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

    getUserBtns = (user) => {
        if (!user) {
            return (
                <div>
                    <div className="user-btn wide flex">
                        <a class="button" onClick={this.props.showLogin}>
                            Login
                        </a>
                    </div>
                    <div className="user-btn wide flex">
                        <a class="button button-reg" onClick={this.props.showLogin}>
                            Register
                        </a>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="user-btn flex">
                    <FontAwesomeIcon className="icon" icon="bell" size="2x" />
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
                        <div className="title flex">STREAMIFY</div>
                    </div>

                    {this.state.width >= 650 && (
                        <div>
                            <div className="search flex">
                                <input className="inputfield" type="number" placeholder="Order #"></input>
                                <div className="user-btn wide flex">
                                    <a href="#" class="button button-reg" onClick={this.props.showLogin}>
                                        Search
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
