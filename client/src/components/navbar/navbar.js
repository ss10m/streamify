import React from 'react';
import './navbar.css';
import { ButtonToolbar } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import LogInModal from './loginmodal.js';
import { NavItem, NavDropdown } from './navComponents.js';



class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalShow: false };
  }

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
    let modalClose = () => this.setState({ modalShow: false });
    if(!this.props.session) {
      return(
        <ButtonToolbar>
          <button 
            className="btn btn-outline-light my-2 my-sm-0" 
            onClick={() => this.setState({ modalShow: true })}
          >
            Log in
          </button>

          <LogInModal
            show={this.state.modalShow}
            onHide={modalClose}
          />
        </ButtonToolbar>)
    } else {
      return (
        <ButtonToolbar>
          <button 
            type="button"
            className="btn btn-outline-light my-2 my-sm-0"
            onClick={this.handleClick}
          >
            Log out
          </button>
        </ButtonToolbar>)
    }
  }

  

  render() {
 
    return (
      <nav className="navbar-custom navbar navbar-custom navbar-expand-lg navbar-dark">
        <a className="navbar-brand" href="/"><b>Twitchify</b></a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            
            <NavItem path="/" name="Home" />
            <NavItem path="/add" name="Add" />
            <NavItem path="/streamers" name="Following" />
            
            <NavDropdown name="Dropdown">
              <a className="dropdown-item" href="/">Action</a>
              <a className="dropdown-item" href="/">Another action</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="/">Something else here</a>
            </NavDropdown>
            
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