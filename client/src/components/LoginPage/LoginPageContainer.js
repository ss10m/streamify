// Libraries & utils
import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { login, closeLoginWindow, register, hideLoginError } from "store/actions.js";

// Components
import LoginPage from "./LoginPage";

class LoginPageContainer extends Component {
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

    componentDidMount() {
        this.setupHistoryListener();
    }

    componentWillUnmount() {
        this.historyListener();
    }

    setupHistoryListener = () => {
        let { history, location } = this.props;
        history.push(location.pathname);
        this.historyListener = history.listen((newLocation, action) => {
            if (action === "POP") this.props.closeLoginWindow();
        });
    };

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
        this.setState({
            view,
            title,
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    login = () => {
        let { username, password } = this.state;
        let userInfo = { username, password };
        this.props.login(userInfo);
    };

    register = () => {
        let { username, email, password, confirmPassword } = this.state;
        let userInfo = { username, email, password, confirmPassword };
        this.props.register(userInfo);
    };

    render() {
        let { username, email, password, confirmPassword } = this.state;
        return (
            <LoginPage
                username={username}
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                view={this.state.view}
                title={this.state.title}
                loginError={this.props.loginError}
                handleClickOutside={this.handleClickOutside}
                switchView={this.switchView}
                handleInput={this.handleInput}
                handleKeyPress={this.handleKeyPress}
                login={this.login}
                register={this.register}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPageContainer));
