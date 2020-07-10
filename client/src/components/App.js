import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import socketIO from "socket.io-client";

import { getSession, showLogin, toggleNavBar } from "../store/actions.js";

import Page1 from "./Page1";
import Page2 from "./Page2";
import LoginPage from "./LoginPage/LoginPage";
import NavBar from "./Navbar/NavBar";
import TopStreamers from "./TopStreamers/TopStreamers";
import Streamers from "./Streamers/Streamers";
import Streamer from "./Streamer/Streamer";
import Search from "./Search/Search";

import "./App.scss";

class App extends Component {
    componentDidMount() {
        console.log("componentDidMount");
        this.props.getSession();
        setTimeout(() => {
            console.log("CONNECTING");
            this.connectSocketIo();
        }, 5000);
    }

    connectSocketIo = () => {
        let socket = socketIO.connect("");

        socket.on("notification", this.handleNotifications);

        this.setState({ socket: socket });
    };

    handleNotifications = () => {
        console.log("handleNotifications");
    };

    hideNavbar = (event) => {
        event.preventDefault();
        if (this.props.expandedNavbar) this.props.toggleNavBar();
    };

    render() {
        let {
            session: { isLoaded },
            loginDisplayed,
            searchDisplayed,
        } = this.props;

        if (!isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <div className="app">
                <NavBar />
                {loginDisplayed && <LoginPage />}
                {searchDisplayed && <Search mode={searchDisplayed} />}

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
        searchDisplayed: state.searchDisplayed,
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
