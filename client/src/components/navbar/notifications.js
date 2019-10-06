import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
        if(this.props.showNotifications) {
            return (
                <div>
                    {this.props.notifications.map(listItem =>
                        <div>
                            {listItem}
                        </div> 
                    )}
                </div>
            )
        }
    }

    render() {
        console.log(this.props.notifications)
        return (
            <div className="notficiationsBackground">
                {this.getNotifications()}
            </div>
            
        )
    }
}

export default withRouter (Notifications);