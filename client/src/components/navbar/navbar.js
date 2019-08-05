import React, { Component } from 'react';
import './navbar.css';
import { ButtonToolbar } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

import { NavDropdown } from './navComponents.js';



class NavBar extends Component {

    handleClick = event => {
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
                        onClick={this.props.modalOpen}
                    >
                        Log in
                    </button>
                </ButtonToolbar>
            )
        } else {
            return (
                <ButtonToolbar>
                        <NavDropdown name={
                                <span><img src='https://static-cdn.jtvnw.net/jtv_user_pictures/7ed5e0c6-0191-4eef-8328-4af6e4ea5318-profile_image-300x300.png' width="30" height="30" alt="MISSING" /> {this.props.session.username}</span>
        
                        }>
                            <li>{this.props.session.username}</li>
                            <li><Link to={'/'} className="nav-link text-primary"> Profile </Link></li>
                            <div className="dropdown-divider"></div>
                            <li onClick={this.handleClick}><li><Link className="nav-link text-primary"> Log out </Link></li></li>
                        </NavDropdown>
                </ButtonToolbar>
            )
        }
    }

    render() {
        return (
            <nav className="navbar-custom navbar navbar-custom navbar-expand-lg navbar-dark">
                <Link to={'/'} className="navbar-brand"> <b>Twitchify</b> </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        
                        <li><Link to={'/'} className="nav-link"> Home </Link></li>
                        <li><Link to={'/add'} className="nav-link"> Add </Link></li>
                        <li><Link to={'/streamers'} className="nav-link"> Followed </Link></li>
                        

                        
                    </ul>

                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
                    </form>

                    <ul className="navbar-nav ml-auto">
                        {this.getButtons()}
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter (NavBar);