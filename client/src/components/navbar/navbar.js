import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';


import './navbar.css';
import Search from './search';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navCollapsed: true,
            showDropdown: false,
            dropbownBtn: true
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

    setDropdownState= (newState) => {
        this.setState({ showDropdown: newState })
        
        setTimeout(function() {
            this.setState({dropbownBtn: true})
        }.bind(this), 100)
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
                <button 
                    className="btn btn-outline-light btn-sm loginButton"
                    onClick={() => { this.props.modalOpen(); this.minimizeNav() }}
                >
                    Log in
                </button>
            )
        } else {
            return (
                <div className="loggedInLogoWrapper">
                    <img 
                        className={((this.props.winWidth > 800) ? 'loggedInLogo' : 'loggedInLogoExpanded')}
                        src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' 
                        onClick={() => { if(!this.state.showDropdown && this.state.dropbownBtn) this.setState({showDropdown: true, dropbownBtn: false})}}
                        width="30" height="30" alt="MISSING" />
                </div>  
                
            )
        }
    }

    getNavBarBody = () => {
        var navbarClass = "flexboxContainerMini";
        var navbarSearchClass= "centerSearchBarMini";
        var navbarDivClassRight = "flexboxItemRightMini";
        var navbarLink = "navbar-link-mini";
        if(this.props.winWidth > 800) {
            navbarClass = "flexboxContainer";
            navbarSearchClass = "centerSearchBar";
            navbarDivClassRight = "flexboxItemRight"
            navbarLink = "navbar-link";
        }

        if(this.state.navCollapsed) {
            navbarClass = "flexboxContainer";
        }

        return (
            <div className={navbarClass}>
                <Link to={'/'} className="navbar-link-title"> <div className="flexboxItem" onClick={() => this.minimizeNav()}><p>Twitchify</p></div> </Link>
                <Link to={'/'} className={navbarLink}> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Home</div> </Link>
                <Link to={'/streamers'} className={navbarLink}> <div className="flexboxItem" onClick={() => this.minimizeNav()}>Followed</div> </Link>

                <div className={"flexboxitemSearch " + navbarSearchClass}>
                    <div className="centerSearchBar">
                        <Search category="channels" minimizeNav={this.minimizeNav}/>
                    </div>
                    
                </div>
                <div className="flexboxitemLogout">
                    <div className={"userOptions userLogo " + navbarDivClassRight}>
                        {this.getButtons()}
                        <UserDropdownOptions 
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
        var navbarClass = "flexboxContainerMini";
        var navbarMini = true;
        if(this.props.winWidth > 800) {
            navbarClass = "flexboxContainer";
            navbarMini = false;
        }

        if(this.state.navCollapsed) {
            navbarClass = "flexboxContainer";
        }
    
        if(!navbarMini) {
            return (
                this.getNavBarBody()
            )
        } else if(navbarMini && !this.state.navCollapsed) {
            return (
                this.getNavBarBody()
            )
        } else {
            return (
                <div className={navbarClass}>
                    <Link to={'/'} className="navbar-link-title"> <div className="flexboxItem"><p>Twitchify</p></div> </Link>
                </div>
            )
        }
    }

    render() {


        return (
            <div>
                {this.getNavBar()}
                <button className="barsButton" onClick={this.toggleNav} style={{display: (this.props.winWidth <= 800) ? 'block' : 'none' }}>
                    <i class="fa fa-bars fa-2x bars"></i>
                </button>
            </div>
        )
    }
}

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

export default withRouter (NavBar);