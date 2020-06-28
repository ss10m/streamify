import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import { getSession, login, logout, showLogin, toggleNavBar } from "../store/actions.js";

import Page1 from "./Page1";
import Page2 from "./Page2";
import LoginPage from "./LoginPage/LoginPage";
import NavBar from "./Navbar/NavBar";
import TopStreamers from "./TopStreamers/TopStreamers";
import Streamers from "./Streamers/Streamers";
import Streamer from "./Streamer/Streamer";

import "./App.scss";

class App extends Component {
    componentDidMount() {
        console.log("componentDidMount");
        this.props.getSession();
    }

    hideNavbar = (event) => {
        event.preventDefault();
        if (this.props.expandedNavbar) this.props.toggleNavBar();
    };

    render() {
        let {
            session: { isLoaded, user },
            loginDisplayed,
        } = this.props;

        if (!isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <div className="app">
                <NavBar />
                {loginDisplayed && <LoginPage />}

                <div className="mainbody" onClick={this.hideNavbar}>
                    <TopStreamers />
                    <div className="streamers">
                        <Switch>
                            <Route exact path="/">
                                <Page1 />
                            </Route>
                            <Route exact path="/page2">
                                <Page2 />
                            </Route>
                            <Route exact path="/streamer/:id" render={(props) => <Streamer />} />
                            <Route exact path="/streamers">
                                <Streamers />
                            </Route>
                            <Route render={() => <h1>404</h1>} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        loginDisplayed: state.loginDisplayed,
        expandedNavbar: state.toggleNavbar,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSession: () => {
        dispatch(getSession());
    },
    showLogin: () => {
        dispatch(showLogin());
    },
    toggleNavBar: () => {
        dispatch(toggleNavBar());
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
