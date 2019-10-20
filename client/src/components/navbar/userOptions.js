import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';

import './userOptions.css';

class UserDropdownOptions extends Component {

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            if(this.props.showDropdown) {
                this.props.setDropdownState(false)
            }
        }
    }

    getDropdown = () => {
        if(this.props.showDropdown) {
            return (
                <div className="user-options">
                    <div className="user-option">
                        <i className="fa fa-user"></i>
                        <div>
                            <p className="user-option__signed-in-title">Signed in as:</p>
                            <p className="user-option__signed-in-as">{this.props.session.username}</p>
                        </div>
                    </div>

                    <hr className="user-option__divider"/>

                    <div className="user-option user-option-selectable" onClick={() => { this.props.setDropdownState(false); this.props.minimizeNav(); window.open("https://github.com/fastf20/Twitchify") }}>
                        <i className="fa fa-globe"></i>
                        <p>About Twitchify</p>
                    </div>

                    <div className="user-option user-option-selectable" onClick={() => { this.props.setDropdownState(false); this.props.minimizeNav() }}>
                        <i className="fa fa-cog"></i>
                        <p>Settings</p>
                    </div>

                    <hr className="user-option__divider"/>

                    <div className="user-option user-option-selectable" onClick={() => { this.props.logOut(); this.props.setDropdownState(false); this.props.minimizeNav() }}>
                        <i className="fa fa-sign-out"></i>
                        <p>Logout</p>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.getDropdown()}
            </div>
            
        )
    }
}

export default withRouter (UserDropdownOptions);