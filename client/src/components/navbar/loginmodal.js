import React from 'react';
import { Modal, Tabs, Tab } from 'react-bootstrap';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

class LogInModal extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            error: false,
            selectedTab: 'login'
        };

    }
    
    validateFormLogin() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }
    
    validateFormRegister() {
        return this.state.username.length > 0 && this.state.password.length > 0 &&
            this.state.confirmPassword.length > 0 && this.state.password === this.state.confirmPassword;
    }
  
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value,
            error: false
        });
    }
  
    handleSubmit = event => {
        event.preventDefault(); // Prevent the form from submitting

        fetch('/' + this.state.selectedTab, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: this.state.username,
                password: this.state.password 
            }),
        })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;    
        })
        .then(res => res.json())
        .then(data =>  {
            this.props.onHide();
            this.setState({ username: '',
                            password: '',
                            error : false})
            console.log(data)
            localStorage.setItem("jwt", JSON.stringify(data));
            this.props.updateSession(data.user);
        
            if(this.props.location.pathname !== '/streamers') {
                this.props.history.push('/streamers')
            }
        }).catch(response => {
            console.log(response)
            this.setState({ error : true})
        });
    }

    getAlert = () => {
        if(this.state.error) {
            return (
                <div id="formAlert" className="alert hide">  
                    <strong>Error!</strong> Invalid username or password
                </div>
            )
        }
    }

    hideModal = () => {
        this.setState({ username: '',
                        password: '',
                        confirmPassword: '',
                        error : false});
        this.props.onHide();
    }

    handleTabChange = (currentKey) => {
        this.setState({username: '',
                       password: '',
                       confirmPassword: '',
                       error: false,
                       selectedTab: currentKey})
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
                    {this.getAlert()}
                    <Button
                        size="lg"
                        block
                        disabled={!this.validateFormLogin()}
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
                    </FormGroup>
                    <FormGroup controlId="confirmPassword">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl
                            value={this.state.confirmPassword}
                            type="password"
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    {this.getAlert()}
                    <Button
                        size="lg"
                        block
                        disabled={!this.validateFormRegister()}
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
        console.log(this.state.selectedTab)
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
                    <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" onSelect={this.handleTabChange}>
                        <Tab eventKey="login" title="Login">
                            {this.getLoginForm()}
                        </Tab>
                        <Tab eventKey="register" title="Register">
                            {this.getRegisterForm()}
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer className='logInModal'>
                    <button className="btn btn-outline-light my-2 my-sm-0" onClick={this.hideModal}>Close</button>
                </Modal.Footer>
    
            </Modal>
      );
    }
  }


export default withRouter (LogInModal);