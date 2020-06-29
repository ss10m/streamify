import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { login, closeLoginWindow, register, hideLoginError } from "../../store/actions.js";

import "./LoginPage.scss";

import Input from "./Input";

class LoginPageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "default",
            title: "LOGIN TO TWITCHIFY",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };
    }

    handleClickOutside = (event) => {
        event.preventDefault();

        if (event.target.className === "login-page") {
            this.props.closeLoginWindow();
        }
    };

    handleInput = (inputType) => {
        return (event) => {
            this.setState({
                [inputType]: event.target.value,
            });
        };
    };

    handleKeyPress = (func) => {
        return (event) => {
            if (event.key === "Enter") {
                func();
            }
        };
    };

    switchView = (view) => {
        let title = "";
        switch (view) {
            case "login":
                title = "LOGIN TO TWITCHIFY";
                break;
            case "register":
                title = "REGISTER ACCOUNT";
                break;
            default:
                title = "LOGIN TO TWITCHIFY";
                break;
        }
        this.props.hideLoginError();
        this.setState({ view, title, username: "", email: "", password: "", confirmPassword: "" });
    };

    getView = () => {
        let { view } = this.state;
        switch (view) {
            case "login":
                return this.getLoginView();
            case "register":
                return this.getRegistrationView();
            default:
                return this.getDefaultView();
        }
    };

    getDefaultView = () => {
        return (
            <>
                <div className="top flex">
                    <FontAwesomeIcon
                        icon="user-circle"
                        size="10x"
                        onClick={() => this.setState({ showAddItems: true })}
                    />
                </div>
                <div className="btn login flex" onClick={() => this.switchView("login")}>
                    LOGIN
                </div>
                <div className="btn register flex" onClick={() => this.switchView("register")}>
                    CREATE ACCOUNT
                </div>
            </>
        );
    };

    getLoginView = () => {
        return (
            <>
                <div className="top flex">
                    <Input
                        title="Username"
                        icon="user"
                        value={this.state.username}
                        onChangeValue={this.handleInput("username")}
                        onKeyPress={this.handleKeyPress(this.login)}
                        autoFocus={true}
                    />
                    <Input
                        title="Password"
                        icon="key"
                        value={this.state.password}
                        onChangeValue={this.handleInput("password")}
                        onKeyPress={this.handleKeyPress(this.login)}
                    />
                </div>
                <div className="btn login flex" onClick={this.login}>
                    LOGIN
                </div>
                <div className="btn cancel flex" onClick={() => this.switchView("default")}>
                    CANCEL
                </div>
            </>
        );
    };

    getRegistrationView = () => {
        return (
            <>
                <div className="top flex">
                    <Input
                        title="Username"
                        icon="user"
                        value={this.state.username}
                        onChangeValue={this.handleInput("username")}
                        onKeyPress={this.handleKeyPress(this.register)}
                        autoFocus={true}
                    />
                    <Input
                        title="Email"
                        icon="at"
                        value={this.state.email}
                        onChangeValue={this.handleInput("email")}
                        onKeyPress={this.handleKeyPress(this.register)}
                    />
                    <Input
                        title="Password"
                        icon="key"
                        value={this.state.password}
                        onChangeValue={this.handleInput("password")}
                        onKeyPress={this.handleKeyPress(this.register)}
                    />
                    <Input
                        title="Confirm Password"
                        icon="key"
                        value={this.state.confirmPassword}
                        onChangeValue={this.handleInput("confirmPassword")}
                        onKeyPress={this.handleKeyPress(this.register)}
                    />
                </div>
                <div className="btn login flex" onClick={this.register}>
                    CREATE ACCOUNT
                </div>
                <div className="btn cancel flex" onClick={() => this.switchView("default")}>
                    CANCEL
                </div>
            </>
        );
    };

    login = () => {
        let { username, password } = this.state;

        //loginHelper("czelo22@email.com", "Password1!");
        let userInfo = { username, password };
        console.log(userInfo);
        //let userInfo = { username: "czelo22", password: "Password1!" };
        this.props.login(userInfo);
    };

    register = () => {
        let { username, email, password, confirmPassword } = this.state;
        let userInfo = { username, email, password, confirmPassword };
        this.props.register(userInfo);
    };

    render() {
        return (
            <div className="login-page" onClick={this.handleClickOutside}>
                <div className="login-box">
                    <div className="flex header">{this.state.title}</div>
                    {this.props.loginError && (
                        <div className="error-msg flex">
                            <p>{this.props.loginError}</p>
                        </div>
                    )}
                    <div className="body">{this.getView()}</div>
                    <hr className="divider" />
                    <div className="footer">
                        <div className="flex">
                            <p onClick={() => console.log("TOS")}>Terms of Service</p>
                        </div>
                        <div className="flex">
                            <p onClick={() => console.log("PP")}>Privacy Policy</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        loginError: state.loginError,
    };
};

const mapDispatchToProps = (dispatch) => ({
    login: (userInfo) => {
        dispatch(login(userInfo));
    },
    register: (userInfo) => {
        dispatch(register(userInfo));
    },
    closeLoginWindow: () => {
        dispatch(closeLoginWindow());
    },
    hideLoginError: () => {
        dispatch(hideLoginError());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPageView));
