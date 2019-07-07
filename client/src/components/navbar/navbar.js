import React from 'react';
import './navbar.css';
import { ButtonToolbar, Modal, FormGroup, FormControl, FormLabel } from 'react-bootstrap';

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
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email">
                <FormLabel >Email</FormLabel >
                <FormControl
                  autoFocus
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId="password">
                <FormLabel >Password</FormLabel >
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>

              <button className="btn-block btn btn-outline-dark my-2 my-sm-0" disabled={!this.validateForm()} type="submit">Log in</button>

            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className='logInModal'>
          <button className="btn btn-outline-light my-2 my-sm-0" onClick={this.props.onHide}>Close</button>
        </Modal.Footer>

      </Modal>
    );
  }
}

class NavBar extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { modalShow: false };
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
          </ul>

        </div>
      </nav>
    )
  }
}

export default NavBar;