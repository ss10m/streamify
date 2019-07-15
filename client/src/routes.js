import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

import './components/app/app.css'
import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import Add from './components/add/add';
import NavBar from './components/navbar/navbar.js';
import TopStreamers from './components/topStreamers/topStreamers'
var React = require('react');


export default (
    <BrowserRouter>
        <div>
            <NavBar />
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
                <Route exact path='/' render={() => (
                            <h1>home page!</h1>
                        )}/>
                <Route path='/streamers' component={Streamers} />
                <Route path='/streamer/:streamerid' component={Streamer} />
                <Route path='/add' component={Add} />
                <Route render={() => (
                        <h1>404 Not Found!</h1>
                    )}/>
            </Switch>
        </div>
    </BrowserRouter>
  )
