import React, { Component } from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import socketIO from "socket.io-client";

import { getSession, showLogin, toggleNavBar, addNotifications } from "store/actions.js";

import WindowSize from "./WindowSize/WindowSize";
import Page1 from "./Page1";
import Page2 from "./Page2";
import LoginPage from "./LoginPage/LoginPage";
import NavBar from "./Navbar/NavBar";
import TopStreamers from "./TopStreamers/TopStreamersContainer";
import Streamers from "./Streamers/StreamersContainer";
import Streamer from "./Streamer/Streamer";
import Search from "./Search/Search";

import "./App.scss";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: null };
    }

    componentDidMount() {
        this.props.getSession();
    }

    componentDidUpdate(prevProps, prevState) {
        let { session } = this.props;
        let { socket } = this.state;

        if (session !== prevProps.session) {
            console.log("SESSION GOT UPDATED");
            if (session.user) {
                console.log("LOGGED IN");
                console.log("CONNECTING SESSION");
                this.connectSocket();
            }

            if (!session.user && socket) {
                console.log("LOGGED OUT");
                console.log("DISCONNECTING SESSION");
                socket.disconnect();
                this.setState({ socket: null });
            }
        }
    }

    connectSocket = () => {
        let socket = socketIO.connect();
        socket.on("update", this.handleUpdate);
        socket.on("notification", this.handleNotification);
        this.setState({ socket });
    };

    handleUpdate = (data) => {
        console.log(data);
    };

    handleNotification = (data) => {
        console.log(data);

        for (let notificaiton of data) {
            console.log(`${notificaiton.display_name} IS PLAYING ${notificaiton.game}`);
            console.log(notificaiton.logo);
        }

        this.props.addNotifications(data);
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
            <>
                <WindowSize />
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
