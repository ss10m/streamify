import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './components/app/app';
import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import Add from './components/add/add';
var React = require('react');


export default (
    <BrowserRouter>
        <Route component={App} />
        <div className='streamers'>
            <Switch>
                <Route exact path='/' component={Streamers} />
                <Route path='/streamer/:streamerid' component={Streamer} />
                <Route path='/add' component={Add} />
                <Route render={() => (
                        <h1>404 Not Found!</h1>
                    )}/>
            </Switch>
        </div>
    </BrowserRouter>
  )
