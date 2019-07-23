import React from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';

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
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Log in to Twitchify
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
  
  
            <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
              <Tab eventKey="login" title="Login">
                <div className="login">
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
                <div className="login">
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


  export default LogInModal;