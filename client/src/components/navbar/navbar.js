import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
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
        console.log('toggleNav')
        this.setState({ navCollapsed: !this.state.navCollapsed })
    }

    minimizeNav = () => {
        this.setState({ navCollapsed: true })
    }

    setDropdownState= (newState) => {
        this.setState({ showDropdown: newState })
        
        setTimeout(function() {
            this.setState({dropbownBtn: true})
        }.bind(this), 100)
    }   

    logOut = event => {
        event.preventDefault();
        
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
                <ButtonToolbar>
                    <button 
                        className="btn btn-outline-light my-2 my-sm-0" 
                        onClick={() => { this.props.modalOpen(); this.minimizeNav() }}
                    >
                        Log in
                    </button>
                </ButtonToolbar>
            )
        } else {
            return (
                <ButtonToolbar>
                    <div className="logoButton">
                        <img 
                            className="loggedInLogo"
                            src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' 
                            onClick={() => { if(!this.state.showDropdown && this.state.dropbownBtn) this.setState({showDropdown: true, dropbownBtn: false})}}
                            width="30" height="30" alt="MISSING" />
                    </div>
                    
                    
                </ButtonToolbar>
            )
        }
    }

    render() {
        return (
            <nav className={(this.state.navCollapsed ? 'navbar-custom' : 'navbar-custom-expaneded') + " navbar navbar-custom navbar-expand-lg navbar-dark"}>
                <Link onClick={this.minimizeNav} to={'/'} className="navbar-brand"> <b>Twitchify</b> </Link>
                <button onClick={this.toggleNav} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={(this.state.navCollapsed ? 'collapse' : '') + ' navbar-collapse'}>
                    <ul className="navbar-nav mr-auto" onClick={this.minimizeNav}>

                        <li><Link to={'/'} className="nav-link"> Home </Link></li>
                        <li><Link to={'/add'} className="nav-link"> Add </Link></li>
                        <li><Link to={'/streamers'}  className="nav-link"> Followed </Link></li>  
                    </ul>

                    <Search category="channels"/>

                    <div className="navbar-nav ml-auto userOptions userLogo">
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
            </nav>
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
                <div onClick={() => { this.props.setDropdownState(false) }} className="userOptions-items">
                    <div className="userOptions-item">
                        <i class="fa fa-user userOptions-2"></i>
                        <p className="userOptions-2">Signed in as: {this.props.session.username}</p>
                    </div>
                    <div className="userOptions-item userOptions-items-selectable">
                        <i class="fa fa-globe userOptions-2"></i>
                        <p className="userOptions-2">About</p>
                    </div>
                    <hr className="userOptionsSplit"/>
                    <div className="userOptions-item userOptions-items-selectable">
                        <i class="fa fa-sign-out userOptions-2"></i>
                        <button className="btn btn-link my-2 my-sm-0 userOptions-2" onClick={(event) => { this.props.logOut(event); this.props.minimizeNav() }}>
                            Logout
                        </button>
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