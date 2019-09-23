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
            console.log('clicked outside')
            if(this.props.showDropdown) {
                this.props.setDropdownState(false)
            }
        }
    }

    getDropdown = () => {
        if(this.props.showDropdown) {
            return (
                <div className="userOptions-items"  onClick={() => { this.props.setDropdownState(false); this.props.minimizeNav() }}>
                    <div className="userOptions-item">
                        <i class="fa fa-user"></i>
                        <div>
                            <p className="userOptions-choices userOptions-signedin">Signed in as:</p>
                            <p className="userOptions-choices userOptions-name">{this.props.session.username}</p>
                        </div>
                    </div>

                    <hr className="userOptionsSplit"/>

                    <div className="userOptions-item userOptions-item-selectable">
                        <i class="fa fa-globe"></i>
                        <p className="userOptions-choices">About Twitchify</p>
                    </div>

                    <div className="userOptions-item userOptions-item-selectable">
                        <i class="fa fa-cog"></i>
                        <p className="userOptions-choices">Settings</p>
                    </div>

                    <hr className="userOptionsSplit"/>

                    <div className="userOptions-item userOptions-item-selectable" onClick={() => { this.props.logOut() }}>
                        <i class="fa fa-sign-out"></i>
                        <p className="userOptions-choices">Logout</p>
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