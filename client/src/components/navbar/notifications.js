import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';


import './notifications.css';

class Notifications extends Component {

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            if(this.props.showNotifications) {
                this.props.setNotificationsState(false)
            }
        }
    }

    removeNotification = (index, streamerName) => {
        console.log('removing ' + index + streamerName)
    }

    getNotifications = () => {
        if(this.props.showNotifications && this.props.notifications.length > 0) {
            return (
                <div className="notificiationsBackground">
                    <div className="notificiationTitle">
                        <b>Notifications</b>
                        <i className="fa fa-times closeNotifications" onClick={() => this.props.setNotificationsState(false)}/>
                    </div>
                    <div className="notificiationItems">
                        {this.props.notifications.map((notification, index) =>
                            <Link style={{ textDecoration: 'none', color: 'white' }} to={"/streamer/" + notification.name} key={index} onClick={() => this.props.setNotificationsState(false)}>
                                <div className="notificiationItem">
                                    <img src={notification.logo} width="25" height="25" alt="MISSING" />                              
                                    <div className="notificationMsg">{notification.name + ' is playing '}<b>{notification.game}</b></div>
                                    <div className="deleteNotificationWrapper" onClick={() => this.removeNotification(index, notification.name)}><i className="fa fa-times deleteNotification"/></div>
                                </div> 
                            </Link>
                        )}
                    </div>
                </div>
            )
        } else if(this.props.showNotifications) {
            return (
                <div className="notificiationsBackground">
                    <div className="notificiationTitle">
                        <b>Notifications</b>
                        <i className="fa fa-times closeNotifications" onClick={() => this.props.setNotificationsState(false)}/>
                    </div>
                    <div className="notificiationsEmpty">
                        <b>Nothing appears to be here :(</b>
                    </div>
                </div>
            )
        }

    }

    render() {
        return (
            <div>
                {this.getNotifications()}
            </div>
        )
    }
}

export default withRouter (Notifications);