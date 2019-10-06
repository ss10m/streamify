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
            notificationsBtn: true
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
                <div className="loginButtonWrapper">
                    <button 
                        className="btn btn-outline-light btn-sm loginButton"
                        onClick={() => { this.props.modalOpen(); this.minimizeNav() }}
                    >
                        Log in
                </button>
                </div>

            )
        } else {
            return (
                <div className="loggedInLogoWrapper">
                    <img 
                        src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' 
                        onClick={() => { if(!this.state.showDropdown && this.state.dropbownBtn) this.setState({showDropdown: true, dropbownBtn: false})}}
                        width="30" height="30" alt="MISSING" />
                </div>  
                
            )
        }
    }


    getNavBarBody = () => {
        
        return (
            <div className="flexboxContainer">
                <Link to={'/'} className="navbar-link-title"> <div className="flexboxItem" onClick={() => this.minimizeNav()}><p>Twitchify</p></div> </Link>
                <Link to={'/'} className="navbar-link"> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Home</div> </Link>
                <Link to={'/streamers'} className="navbar-link"> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Followed</div> </Link>

                <div className="flexboxitemSearch centerSearchBar">
                    <div className="centerSearchBar">
                        <Search category="channels" minimizeNav={this.minimizeNav}/>
                    </div>
                    
                </div>

                <div className="flexboxitemNotifications notifications">
                    <i className="fa fa-bell fa-2x notifications notificationsIcon" 
                        onClick={() => { if(!this.state.showNotifications && this.state.notificationsBtn) this.setState({showNotifications: true, notificationsBtn: false})}}>
                    </i>

                    <div class="notificationsDropdownMini notificationsDropdown">
                        <Notifications 
                            winWidth={this.props.winWidth}
                            notifications={this.props.notifications}
                            showNotifications={this.state.showNotifications} 
                            setNotificationsState={this.setNotificationsState}
                            session={this.props.session} 
                            logOut={this.logOut} 
                        />
                    </div>
                </div>

                <div className="flexboxitemLogout">
                    <div className="userOptions">
                        {this.getButtons()}
                        <div class="userOptionsDropdownMini userOptionsDropdown">
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
        var MainClassName = "flexboxContainerMini";
        var displayStyle = "block";
        if(this.state.navCollapsed) {
            MainClassName = "flexboxContainer";
            displayStyle = "none";
        }

        return (
            <div className={MainClassName}>
                <Link to={'/'} className="navbar-link-title"> <div className="flexboxItem" onClick={() => this.minimizeNav()}><p>Twitchify</p></div> </Link>
                <Link to={'/'} className="navbar-link-mini" style={{display: displayStyle}}> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Home</div> </Link>
                <Link to={'/streamers'} className="navbar-link-mini" style={{display: displayStyle}}> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Followed</div> </Link>

                <div className="centerSearchBarMini" style={{display: displayStyle}}>>
                        <Search category="channels" minimizeNav={this.minimizeNav}/>
                </div>

                <div className="notificationsMini">
                    <i className="fa fa-bell notificationsIcon" 
                        onClick={() => { if(!this.state.showNotifications && this.state.notificationsBtn) this.setState({showNotifications: true, notificationsBtn: false})}}>
                    </i>
                    <div class="notificationsDropdownMini">
                        <Notifications 
                            winWidth={this.props.winWidth}
                            notifications={this.props.notifications}
                            showNotifications={this.state.showNotifications} 
                            setNotificationsState={this.setNotificationsState}
                            session={this.props.session} 
                            logOut={this.logOut} 
                        />
                    </div>
                </div>
                <div className="userOptionsMini">
                    {this.getButtons()}
                    <div class="userOptionsDropdownMini">
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
                    <i className="fa fa-bars fa-2x bars"></i>
                </button>
            </div>
        )
    }
}

export default withRouter (NavBar);