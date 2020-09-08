// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import {
    showLogin,
    toggleNavBar,
    showSearch,
    clearNotificationsIndicator,
} from "store/actions.js";

// Components
import NavBar from "./NavBar";

class NavBarContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { showUserOptions: false, showNotifications: false };
    }

    toggleDropDown = (event) => {
        if (event) event.stopPropagation();
        this.setState((prevState) => ({
            showUserOptions: !prevState.showUserOptions,
        }));
    };

    toggleNotifications = (event) => {
        event.stopPropagation();
        this.setState((prevState) => ({
            showNotifications: !prevState.showNotifications,
        }));
        this.props.clearNotificationsIndicator();
    };

    render() {
        let { showUserOptions, showNotifications } = this.state;
        let {
            windowSize,
            expandedNavbar,
            toggleNavBar,
            notifications,
            showLogin,
            showSearch,
            session,
        } = this.props;

        return (
            <NavBar
                user={session.user}
                windowSize={windowSize}
                extended={expandedNavbar && windowSize < 650}
                showUserOptions={showUserOptions}
                notificationsIndicator={notifications.newNotifications > 0}
                showNotifications={showNotifications}
                showSearch={showSearch}
                showLogin={showLogin}
                toggleDropDown={this.toggleDropDown}
                toggleNotifications={this.toggleNotifications}
                toggleNavBar={toggleNavBar}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        expandedNavbar: state.toggleNavbar,
        userOptions: state.userOptions,
        notifications: state.notifications,
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    showLogin: () => {
        dispatch(showLogin());
    },
    toggleNavBar: () => {
        dispatch(toggleNavBar());
    },
    showSearch: () => {
        dispatch(showSearch());
    },
    clearNotificationsIndicator: () => {
        dispatch(clearNotificationsIndicator());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBarContainer);
