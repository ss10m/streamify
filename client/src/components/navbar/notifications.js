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

    getNotifications = () => {
        if(this.props.showNotifications && this.props.notifications.length > 0) {
            return (
                <div className="notifications--background">
                    <div className="notifications__header">
                        <i className="fa fa-trash notifications__clear-btn" onClick={() => this.props.removeNotification(null, null, true)}/>
                        <b>Notifications</b>
                        <i className="fa fa-times notifications__close-btn" onClick={() => this.props.setNotificationsState(false)}/>
                    </div>
                    <div className="notifications__list">
                        {this.props.notifications.map((notification, index) =>
                             <div className="notificiation" key={index}>
                                <Link className="notification__link" style={{ textDecoration: 'none', color: 'white' }} to={"/streamer/" + notification.name} key={index} onClick={() => this.props.setNotificationsState(false)}>
                                    <img src={notification.logo} width="25" height="25" alt="MISSING" />                              
                                    <div className="notification__msg">{notification.name + ' is playing '}<b>{notification.game}</b></div>
                                </Link>
                                <div className="notification__remove__container" >
                                    <i onClick={() => this.props.removeNotification(index, notification.name, false)} className="fa fa-times notification__remove-btn"/>
                                </div>    
                            </div>
                        )}
                    </div>
                </div>
            )
        } else if(this.props.showNotifications) {
            return (
                <div className="notifications--background">
                    <div className="notifications__header">
                        <i className="fa fa-trash notifications__clear-btn" onClick={() => this.props.removeNotification(null, null, true)}/>
                        <b>Notifications</b>
                        <i className="fa fa-times notifications__close-btn" onClick={() => this.props.setNotificationsState(false)}/>
                    </div>
                    <div className="notification__empty">
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