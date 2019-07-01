import { BrowserRouter, Route } from 'react-router-dom';

import App from './components/app/app';
import Streamer from './components/streamer/streamer';
import Streamers from './components/streamers/streamers';
import Add from './components/add/add';
var React = require('react');



export default (
    <BrowserRouter>
        <App/>
        <div className='streamers'>
            <Route path='/streamers' component={Streamers} />
            <Route path='/streamer/:streamerid' component={Streamer} />
            <Route path='/add' component={Add} />
        </div>
    </BrowserRouter>
  )


  //<Route path='/streamer/:streamerid' render={(props) => <Streamer streamerid={props.streamerid}/> } />