import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';


import './navbar.css';
import UserDropdownOptions from './userOptions.js'
import Notifications from './notifications.js'
import Search from './search';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navCollapsed: true,
            showDropdown: false,
            showNotifications: false,
            dropbownBtn: true,
            notificationsBtn: true,
        };
    }

    toggleNav = () => {
        console.log(this.state.navCollapsed +' toggleNav')
        this.setState({ navCollapsed: !this.state.navCollapsed })
    }

    minimizeNav = () => {
        if(!this.state.navCollapsed) {
            this.setState({ navCollapsed: true })
        }
    }

    setDropdownState = (newState) => {
        this.setState({ showDropdown: newState })
        
        setTimeout(function() {
            this.setState({dropbownBtn: true})
        }.bind(this), 100)
    }   

    setNotificationsState = (newState) => {
        this.setState({ showNotifications: newState })

        setTimeout(function() {
            this.setState({notificationsBtn: true})
        }.bind(this), 100)
    }  

    componentDidUpdate(prevProps) {
        if(this.props.newNotifications === true && this.state.showNotifications) {
            this.props.resetNewNotifications()
        } 

    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            if(!this.props.navCollapsed) {
                this.minimizeNav();
            }
        }
    }

    logOut = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                user: 'user'
            }),
        }).then(response => {
            this.props.history.push('/');
            this.props.onLogout();
        }).catch(function(err) {
            console.info(err);
        });
    }

    getButtons() {
        if(!this.props.session) {
            return(
                <div className="cus-navbar__user-options-btn-container">
                    <button 
                        className="btn btn-outline-light btn-sm cus-navbar__user-options-login-btn"
                        onClick={() => { this.props.modalOpen(); this.minimizeNav() }}
                    >
                        Log in
                    </button>
                </div>
            )
        } else {
            return (
                <div className="cus-navbar__user-options-btn-container">
                    <img 
                        className="cus-navbar__user-options-loggedin-btn"
                        src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' 
                        onClick={() => { if(!this.state.showDropdown && this.state.dropbownBtn) this.setState({showDropdown: true, dropbownBtn: false})}}
                        width="30" height="30" alt="MISSING" />
                </div>  
                
            )
        }
    }

    getNavBarBody = () => {
        return (
            <div className="cus-navbar cus-navbar--full">
                <Link className="cus-navbar__link cus-navbar__link--highlighted" to={'/'}> 
                    <p>Twitchify</p>
                </Link>
                <Link className="cus-navbar__link cus-navbar__link--underline" to={'/'}>
                    Home
                </Link>
                <Link className="cus-navbar__link cus-navbar__link--underline" to={'/streamers'}>
                    Followed
                </Link>

                <div className="cus-navbar__search">
                    <Search category="channels" minimizeNav={this.minimizeNav}/>
                </div>

                <div className="cus-navbar__notifications">

                    <div className="cus-navbar__notifications-icon-container" 
                        onClick={() => {
                            if(!this.state.showNotifications && this.state.notificationsBtn) {
                                this.setState({showNotifications: true, notificationsBtn: false})
                            }
                            this.props.resetNewNotifications()
                            }
                        }>
                        <i className="fa fa-bell cus-navbar__notifications-icon" />
                        <span className="cus-navbar__notifications-badge" style={{display: (this.props.newNotifications) ? 'block' : 'none' }}></span>
                    </div>

                    <div className="cus-navbar__notifications-dropdown cus-navbar__notifications-dropdown-full">
                        <Notifications 
                            winWidth={this.props.winWidth}
                            notifications={this.props.notifications}
                            showNotifications={this.state.showNotifications} 
                            removeNotification={this.props.removeNotification}
                            setNotificationsState={this.setNotificationsState}
                            session={this.props.session} 
                            logOut={this.logOut} 
                        />
                    </div>
                </div>

                <div className="cus-navbar__user-options-container">
                    <div className="cus-navbar__user-options">
                        {this.getButtons()}
                        <div className="cus-navbar__user-options-dropdown cus-navbar__user-options-dropdown--full">
                            <UserDropdownOptions 
                                winWidth={this.props.winWidth}
                                showDropdown={this.state.showDropdown} 
                                setDropdownState={this.setDropdownState}
                                session={this.props.session} 
                                minimizeNav={this.minimizeNav} 
                                logOut={this.logOut} 
                            />
                        </div>
                    </div>
                </div>            
            </div>
        )
    }

    getNavBarMiniBody = () => {
        var mainClassName = "cus-navbar cus-navbar--collapsed";
        var displayStyle = "block";
        var notificationsClass = "cus-navbar__notifications-dropdown";

        if(this.state.navCollapsed) {
            mainClassName = "cus-navbar cus-navbar--full";
            displayStyle = "none";
        }
        if(this.props.winWidth <= 600) {
            notificationsClass = "cus-navbar__notifications-dropdown-collapsed";
        }

        return (
            <div className={mainClassName}>
                <Link to={'/'} className="cus-navbar__link cus-navbar__link--highlighted" onClick={this.minimizeNav}>
                    <p>Twitchify</p>
                </Link>
                <Link to={'/'} className="cus-navbar__link" style={{display: displayStyle}} onClick={this.minimizeNav}>
                    Home
                </Link>
                <Link to={'/streamers'} className="cus-navbar__link" style={{display: displayStyle}} onClick={this.minimizeNav}>
                    Followed
                </Link>

                <div style={{display: displayStyle}}>
                        <Search category="channels" minimizeNav={this.minimizeNav}/>
                </div>

                <div className="cus-navbar__notifications-collapsed" onClick={this.minimizeNav}>
                    <div className="cus-navbar__notifications-icon-container" 
                        onClick={() => {
                            if(!this.state.showNotifications && this.state.notificationsBtn) {
                                this.setState({showNotifications: true, notificationsBtn: false})
                            }
                            this.props.resetNewNotifications()
                            }
                        }>
                        <i className="fa fa-bell cus-navbar__notifications-icon" />
                        <span className="cus-navbar__notifications-badge" style={{display: (this.props.newNotifications) ? 'block' : 'none' }}></span>
                    </div>
                    <div className={notificationsClass}>
                        <Notifications 
                            winWidth={this.props.winWidth}
                            notifications={this.props.notifications}
                            showNotifications={this.state.showNotifications}
                            removeNotification={this.props.removeNotification}
                            setNotificationsState={this.setNotificationsState}
                            session={this.props.session} 
                            logOut={this.logOut} 
                        />
                    </div>
                </div>
                
                <div className="cus-navbar__user-options cus-navbar__user-options-collapsed" onClick={this.minimizeNav}>
                    {this.getButtons()}
                    <div className="cus-navbar__user-options-dropdown">
                        <UserDropdownOptions 
                            winWidth={this.props.winWidth}
                            showDropdown={this.state.showDropdown} 
                            setDropdownState={this.setDropdownState}
                            session={this.props.session} 
                            minimizeNav={this.minimizeNav} 
                            logOut={this.logOut} 
                        />
                    </div>
                </div>   
            </div>

        )
    } 

    getNavBar = () => {
        if(this.props.winWidth > 800) {
            return (
                this.getNavBarBody()
            )   
        } else {
            return (
                this.getNavBarMiniBody()
            )
        }
    }

    render() {
        return (
            <div>
                {this.getNavBar()}
                <button onClick={this.toggleNav} style={{display: (this.props.winWidth <= 800) ? 'block' : 'none' }}>
                    <i className="fa fa-bars fa-2x cus-navbar__toggle-navbar-btn"></i>
                </button>
            </div>
        )
    }
}

export default withRouter (NavBar);