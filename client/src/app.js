import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

import './app.css'

import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import NavBar from './components/navbar/navbar.js';
import TopStreamers from './components/topStreamers/topStreamers'
import LoginModal from './components/navbar/loginmodal'

import socketIO from "socket.io-client";

    
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: '',
            notifications: [],
            modalShow: false,
            winWidth: window.innerWidth,
            response: false,
            endpoint: "http://127.0.0.1:5000"
        };
    }

    handleResize = event => {
        this.setState({winWidth: window.innerWidth});
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);

        var jwt = JSON.parse(localStorage.getItem("jwt"));

        if(jwt) {
            this.setState({session: jwt.user})
        } else {
            console.log('jwt not found')
        }

        const { endpoint } = this.state;
        const socket = socketIO(endpoint, {
            query: {token: JSON.stringify(jwt)}
          });
          
        socket.on('notification', this.handleNotifictaions);
    }

    handleNotifictaions = (data) => {
        var temp = [...this.state.notifications]
        temp.push(data)
        this.setState({notifications: temp});
    }

    onLogout() {
        console.log('on logout')
        this.setState({session: ''})
        localStorage.removeItem("jwt")
    }

    updateSession(jwt) {
        console.log(this.state.session)
        this.setState({session: jwt})
        console.log(this.state.session)
    }

    render() {
        let modalClose = () => this.setState({ modalShow: false });
        let modalOpen = () => this.setState({ modalShow: true });
        let topStreamersTitle = (this.state.winWidth > 800) ? "Top Streamers Live" : "Top";
        return (
            <div>
                <Route render={() => <NavBar winWidth={this.state.winWidth} 
                                             session={this.state.session} 
                                             notifications={this.state.notifications}
                                             onLogout={this.onLogout.bind(this)} 
                                             modalOpen={modalOpen}/>} />
                <LoginModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    updateSession={this.updateSession.bind(this)}
                />
                <div className="mainBody">
                    
                    <div className="sidebar">
                        <div className='divHeading'>
                            <small>{topStreamersTitle}</small>
                        </div>
                        <hr className='split'></hr>
                        <TopStreamers winWidth={this.state.winWidth}/>
                    </div>
                  
                    <div className='streamers'>
                        <Switch>
                            <Route exact path='/' render={() => (
                                        <h1>home page!</h1>
                                    )}/>
                            <Route path='/streamers' render={() => <Streamers session={this.state.session} modalOpen={modalOpen} />} />
                            <Route exact path='/streamer/:id' render={(props) => <Streamer session={this.state.session} modalOpen={modalOpen} {...props}/>}  />      
                            <Route render={() => (
                                        <h1>404</h1>
                                    )}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;