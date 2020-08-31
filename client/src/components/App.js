import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import {
    getSession,
    showLogin,
    toggleNavBar,
    addNotifications,
} from "store/actions.js";

import WindowSize from "./WindowSize/WindowSize";
import Notifications from "./Notifications/Notifications";
import Page1 from "./Page1";
import Page2 from "./Page2";
import LoginPage from "./LoginPage/LoginPageContainer";
import NavBar from "./Navbar/NavBar";
import TopStreamers from "./TopStreamers/TopStreamersContainer";
import Streamers from "./Streamers/StreamersContainer";
import Streamer from "./Streamer/Streamer";
import Search from "./Search/SearchContainer";
import Error from "./Error/Error";

import "./App.scss";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: null };
    }

    componentDidMount() {
        this.props.getSession();
    }

    hideNavbar = (event) => {
        event.preventDefault();
        if (this.props.expandedNavbar) this.props.toggleNavBar();
    };

    render() {
        let {
            session: { isLoaded },
            loginDisplayed,
            searchDisplayed,
            error,
        } = this.props;

        if (error.isVisible) return <Error error={error.message} />;
        if (!isLoaded) return <div>Loading...</div>;

        return (
            <>
                <WindowSize />
                <Notifications />
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
                                <Route
                                    exact
                                    path="/streamer/:id"
                                    render={(props) => <Streamer />}
                                />
                                <Route exact path="/streamers">
                                    <Streamers />
                                </Route>
                                <Route render={() => <h1>404</h1>} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        loginDisplayed: state.loginDisplayed,
        expandedNavbar: state.toggleNavbar,
        searchDisplayed: state.searchDisplayed,
        error: state.error,
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
    addNotifications: (notifications) => {
        dispatch(addNotifications(notifications));
    },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
