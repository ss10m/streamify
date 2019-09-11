import React, { Component } from 'react';
import './navbar.css';
import { ButtonToolbar } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import Search from './search';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navCollapsed: true,
        };
        this.myRef = React.createRef();
    }

    toggleNav = () => {
        console.log('toggleNav')
        this.setState({ navCollapsed: !this.state.navCollapsed })
    }

    minimizeNav = () => {
        this.setState({ navCollapsed: true })
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
                    
                    <button 
                        className="btn btn-link my-2 my-sm-0" 
                        onClick={(event) => { this.logOut(event); this.minimizeNav() }}
                    >   
                        <img src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' width="30" height="30" alt="MISSING" />
                        Logout
                    </button>
                </ButtonToolbar>
            )
        }
    }

    render() {
        const node = this.myRef.current;
        console.log(node)
        console.log(this.state.autocompleteList)



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

                    <Search />

                    <ul className="navbar-nav ml-auto">
                        {this.getButtons()}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter (NavBar);