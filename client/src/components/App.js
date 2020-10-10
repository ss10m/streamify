// Libraries & utils
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import { getSession, toggleNavBar } from "store/actions.js";

// Components
import WindowSize from "./WindowSize/WindowSize";
import Notifications from "./Notifications/Notifications";
import Landing from "./Landing/LandingContainer";
import LoginPage from "./LoginPage/LoginPageContainer";
import NavBar from "./Navbar/NavBarContainer";
import TopStreamers from "./TopStreamers/TopStreamersContainer";
import Streamers from "./Streamers/StreamersContainer";
import Streamer from "./Streamer/StreamerContainer";
import Search from "./Search/SearchContainer";
import Error from "./Error/Error";

// SCSS
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
                                    <Landing />
                                </Route>
                                <Route
                                    exact
                                    path="/streamer/:id"
                                    render={() => <Streamer />}
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
    toggleNavBar: () => {
        dispatch(toggleNavBar());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
