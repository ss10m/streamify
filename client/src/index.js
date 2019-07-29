import ReactDOM from 'react-dom';
import App from './app';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>,
    document.getElementById('root')
);

