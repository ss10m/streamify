import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './components/app/app.css'
import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import Add from './components/add/add';
import NavBar from './components/navbar/navbar.js';
import TopStreamers from './components/topStreamers/topStreamers'
    


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: ''
        };
    }

    componentWillMount() {
        var jwt = JSON.parse(localStorage.getItem("jwt"));

        if(jwt) {
            console.log(jwt.user)
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

    /*
        Example of writing to storage

        window.sessionStorage.setItem("key", "value");
        To retrieve item from storage use

        window.sessionStorage.getItem("key");
    */

    render() {
        return (
            
            <BrowserRouter>
                <div>
                    
                    <Route render={() => <NavBar session={this.state.session} onLogout={this.onLogout.bind(this)} />} />
                    <div className='topStreamers'>
                        <div className='divHeading'>
                            <h3>Top Streamers Live</h3>
                        </div>
                        <hr className='split'></hr>
                        <TopStreamers />
                    </div>  
                </div>
                <div className='streamers'>
                    <Switch>
                        {/*<Route key="home" path="/" render={(props) => <HomeScreen test={this.state.test} {...props} />}/>  */ }
                        <Route exact path='/' render={() => (
                                    <h1>home page!</h1>
                                )}/>
                        <Route path='/streamers' component={Streamers} />
                        <Route path='/streamer/:streamerid' component={Streamer} />
                        <Route path='/add' component={Add} />        
                        <Route path='/add' component={Add} />    
                        <Route path='/login' render={() => (
                                    <h1>show modal</h1>
                                )}/>
                    </Switch>
                </div>
            </BrowserRouter>

        )
    }
}

export default App;


/*
const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

<Router>
    <Switch>
      <PropsRoute path='/login' component={Login} auth={auth} authenticatedRedirect="/" />
      <PropsRoute path='/allbooks' component={Books} booksGetter={getAllBooks} />
      <PropsRoute path='/mybooks' component={Books} booksGetter={getMyBooks} />
      <PropsRoute path='/trades' component={Trades} user={user} />
    </Switch>
</Router>
*/