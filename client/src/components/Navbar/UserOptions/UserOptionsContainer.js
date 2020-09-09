// Libraries & utils
import React, { Component } from "react";
import ReactDOM from "react-dom";

// Redux
import { connect } from "react-redux";
import { logout } from "store/actions.js";

// Helpers
import { dateDifference } from "helpers";

// Components
import UserOptions from "./UserOptions";

class UserOptionsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { showNotifications: true, time: Date.now() };
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
        this.interval = setInterval(
            () => this.setState({ time: Date.now() }),
            1000
        );
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
        clearInterval(this.interval);
    }

    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.toggleDropDown(event);
        }
    };

    logout = () => {
        this.props.logout();
        this.props.toggleDropDown();
    };

    toggleNotifications = (event) => {
        this.setState({ showNotifications: event.target.checked });
    };

    render() {
        let { showNotifications, time } = this.state;
        let { username, last_login } = this.props.session.user;
        let loggedIn = dateDifference(new Date(last_login), time);

        return (
            <UserOptions
                username={username}
                loggedIn={loggedIn}
                showNotifications={showNotifications}
                toggleNotifications={this.toggleNotifications}
                logout={this.logout}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
    };
};

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch(logout());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserOptionsContainer);
