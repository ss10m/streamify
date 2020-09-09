// Libraries & utils
import React from "react";
import { Link } from "react-router-dom";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Helpers
import { dateDifference } from "helpers";

// SCSS
import "./Notifications.scss";

const Notifications = (props) => {
    let { hideNotification, toggleNotifications } = props;
    return (
        <div className="notifications">
            <Header
                hideNotification={hideNotification}
                toggleNotifications={toggleNotifications}
            />
            <div className="scrollable">
                <NotificationList {...props} />
            </div>
        </div>
    );
};

const Header = ({ hideNotification, toggleNotifications }) => {
    return (
        <div className="header">
            <FontAwesomeIcon
                icon="trash"
                size="1x"
                className="header-icon"
                onClick={hideNotification}
            />
            <p>Notifications</p>
            <FontAwesomeIcon
                icon="times"
                size="1x"
                className="header-icon"
                onClick={toggleNotifications}
            />
        </div>
    );
};

const NotificationList = (props) => {
    let {
        notifications: { data },
    } = props;

    if (!data.length) {
        return (
            <div className="empty">
                <FontAwesomeIcon icon="bell" size="5x" className="empty-icon" />
                <p>
                    Follow your favorite streamers to get notified when they
                    play selected games
                </p>
            </div>
        );
    }
    return data.map((notification) => (
        <Notification
            {...props}
            key={notification.id}
            notification={notification}
        />
    ));
};

const Notification = (props) => {
    let { notification, hideNotification, time, toggleNotifications } = props;
    return (
        <Link
            to={"/streamer/" + notification.name}
            className="notification"
            key={notification.id}
            onClick={toggleNotifications}
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
                onClick={(event) => hideNotification(event, notification.id)}
            />

            <p className="time-since">
                {dateDifference(new Date(notification.sent_at), time)}
            </p>
        </Link>
    );
};

export default Notifications;
