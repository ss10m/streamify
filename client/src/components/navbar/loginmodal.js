import React from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class LogInModal extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            username: "",
            password: ""
        };
    }
    
    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }
  
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
  
    handleSubmit = event => {
        event.preventDefault();

        this.props.onHide();
      
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            username: this.state.username,
            password: this.state.password 
            }),
        })
        .then(res => res.json())
        .then(data =>  {
            localStorage.setItem("jwt", JSON.stringify(data));
            this.props.updateSession(data.user);
        
            if(this.props.location.pathname !== '/streamers') {
                this.props.history.push('/streamers')
            }
        });
    }

    getLoginForm() {
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username">
                        <FormLabel>Username</FormLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            value={this.state.password}
                            type="password"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        size="lg"
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                        variant="dark"
                    >
                        Login
                    </Button>
                </form>
            </div>
        )
    }

    getRegisterForm() {
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="username">
                        <FormLabel>Username</FormLabel>
                        <FormControl
                            autoFocus
                            type="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password">
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            value={this.state.password}
                            type="password"
                            onChange={this.handleChange}
                        />
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl
                            value={this.state.password}
                            type="password"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        size="lg"
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                        variant="dark"
                    >
                        Register
                    </Button>
                </form>
            </div>
        )
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
                        {this.getLoginForm()}
                    </Tab>
                    <Tab eventKey="register" title="Register">
                        {this.getRegisterForm()}
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


export default withRouter (LogInModal);