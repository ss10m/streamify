import React from 'react';
import './navbar.css';
import { ButtonToolbar, Modal, FormGroup, FormControl, FormLabel, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom'

const NavItem = props => {
  const pageURI = window.location.pathname+window.location.search
  const liClassName = (props.path === pageURI) ? "nav-item active" : "nav-item";
  const aClassName = props.disabled ? "nav-link disabled" : "nav-link"

  return (
    <li className={liClassName}>
      <a href={props.path} className={aClassName}>
        {props.name}
        {(props.path === pageURI) ? (<span className="sr-only">(current)</span>) : ''}
      </a>
    </li>
  );
}

class NavDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: false
    };
  }
  showDropdown(e) {
    e.preventDefault();
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  render() {
    const classDropdownMenu = 'dropdown-menu' + (this.state.isToggleOn ? ' show' : '')
    return (
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false"
          onClick={(e) => {this.showDropdown(e)}}>
          {this.props.name}
        </a>
        <div className={classDropdownMenu} aria-labelledby="navbarDropdown">
          {this.props.children}
        </div>
      </li>
    )
  }
}

class LogInModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    
    fetch('/api/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: this.state.email,
        password: this.state.password 
      }),
  });
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Log in to Twitchify
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
            <Tab eventKey="login" title="Login">
              <div className="Login">
                <form action="/login" method="post">
                  <div>
                    <label>Username:</label>
                    <input type="text" name="username"/><br/>
                  </div>
                  <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                  </div>
                  <div>
                    <input type="submit" value="Submit"/>
                  </div>
                </form>
              </div>
            </Tab>
            <Tab eventKey="register" title="Register">
              <div className="Register">
                <form action="/login" method="post">
                  <div>
                    <label>Username:</label>
                    <input type="text" name="username"/><br/>
                  </div>
                  <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                  </div>
                  <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                  </div>
                  <div>
                    <input type="submit" value="Submit"/>
                  </div>
                </form>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer className='logInModal'>
          <button className="btn btn-outline-light my-2 my-sm-0" onClick={this.props.onHide}>Close</button>
        </Modal.Footer>

      </Modal>
    );
  }
}

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
      console.log('response');
      console.log(response['url']);
      var url = response['url'].replace('http://localhost:3000', '');
      this.props.history.push(url);
        
    }).catch(function(err) {
        console.info(err);
    });
  }
  

  render() {
    let modalClose = () => this.setState({ modalShow: false });

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
            </ButtonToolbar>
            <ButtonToolbar>
              <button 
                type="button"
                className="btn btn-outline-light my-2 my-sm-0"
                onClick={this.handleClick}
              >
                Log out
              </button>
            </ButtonToolbar>
          </ul>

        </div>
      </nav>
    )
  }
}

export default NavBar;