// Libraries & utils
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import ReactDOM from "react-dom";

// Redux
import { connect } from "react-redux";
import { setNotifications } from "store/actions.js";

// Helpers
import { parseResponse } from "helpers";

// Config
import { API_URL } from "config";

// Components
import Notifications from "./Notifications";

class NotificationsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { time: Date.now() };
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
        clearInterval(this.interval);
    }

    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.toggleNotifications(event);
        }
    };

    hideNotification = async (event, id = -1) => {
        event.preventDefault();
        event.stopPropagation();

        const response = await fetch(`${API_URL}/api/notifications`, {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;
        if (!meta.ok) {
            return window.location.reload(false);
        }
        this.props.setNotifications(data.notifications);
    };

    render() {
        let { notifications, toggleNotifications } = this.props;
        return (
            <Notifications
                time={this.state.time}
                notifications={notifications}
                hideNotification={this.hideNotification}
                toggleNotifications={toggleNotifications}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setNotifications: (notifications) => {
        dispatch(setNotifications(notifications));
    },
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer)
);
