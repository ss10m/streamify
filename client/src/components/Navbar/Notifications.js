import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setNotifications } from "store/actions.js";

import { dateDifference } from "helpers";

import "./Notifications.scss";

class Notifications extends Component {
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

        const response = await fetch("/api/notifications/", {
            method: "POST",
            body: JSON.stringify({ id }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            let data = await response.json();
            if (response.ok) {
                this.props.setNotifications(data);
                return;
            }
            console.log(data.message || "Something went wrong.");
        } catch (err) {
            console.log("Something went wrong.");
        }
    };

    getHeader = () => {
        return (
            <div className="header">
                <FontAwesomeIcon icon="trash" size="1x" className="header-icon" onClick={this.hideNotification} />
                <p>Notifications</p>
                <FontAwesomeIcon
                    icon="times"
                    size="1x"
                    className="header-icon"
                    onClick={this.props.toggleNotifications}
                />
            </div>
        );
    };

    getNotifications = () => {
        let {
            notifications: { data },
        } = this.props;

        if (!data.length) {
            return (
                <div className="empty">
                    <FontAwesomeIcon icon="bell" size="5x" className="empty-icon" />

                    <p>Follow your favorite streamers to get notified when they play selected games</p>
                </div>
            );
        }
        return data.map((notification) => (
            <Link
                to={"/streamer/" + notification.name}
                className="notification"
                key={notification.id}
                onClick={this.props.toggleNotifications}
            >
                <img src={notification.logo} width="60" height="60" alt="MISSING" />
                <div className="info">
                    <p className="name">{notification.display_name}</p>
                    <p className="game">{notification.game}</p>
                </div>

                <FontAwesomeIcon
                    icon="times"
                    size="1x"
                    className="close-icon"
                    onClick={(event) => this.hideNotification(event, notification.id)}
                />

                <p className="time-since">{dateDifference(new Date(notification.sent_at), this.state.time)}</p>
            </Link>
        ));
    };

    render() {
        return (
            <div className="notifications">
                {this.getHeader()}
                <div className="scrollable">{this.getNotifications()}</div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notifications));
