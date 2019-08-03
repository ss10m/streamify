import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import './components/app/app.css'
import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import Add from './components/add/add';
import NavBar from './components/navbar/navbar.js';
import TopStreamers from './components/topStreamers/topStreamers'
import LoginModal from './components/navbar/loginmodal'
    


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: '',
            modalShow: false 
        };
    }

    componentWillMount() {
        var jwt = JSON.parse(localStorage.getItem("jwt"));

        if(jwt) {
            this.setState({session: jwt.user})
        } else {
            console.log('jwt not found')
        }
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
        return (
            
            <div>
                <Route render={() => <NavBar session={this.state.session} onLogout={this.onLogout.bind(this)} modalOpen={modalOpen}/>} />
                <LoginModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    updateSession={this.updateSession.bind(this)}
                />
                <div className='topStreamers'>
                    <div className='divHeading'>
                        <small>Top Streamers Live</small>
                    </div>
                    <hr className='split'></hr>
                    <TopStreamers />
                </div>  
                <div className='streamers'>
                    <Switch>
                        {/*<Route key="home" path="/" render={(props) => <HomeScreen test={this.state.test} {...props} />}/>  */ }
                        <Route exact path='/' render={() => (
                                    <h1>home page!</h1>
                                )}/>
                        <Route path='/streamers' render={() => <Streamers session={this.state.session} modalOpen={modalOpen} />} />
                        <Route exact path='/streamer/:id' render={(props) => <Streamer session={this.state.session} modalOpen={modalOpen} {...props}/>}  />

                        <Route path='/add' component={Add} />          
                        <Route render={() => (
                                    <h1>404</h1>
                                )}/>
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App;