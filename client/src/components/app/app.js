import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import NavBar from '../navbar/navbar.js';
import TopStreamers from '../topStreamers/topStreamers'
import './app.css'

class App extends Component {
    state = {
        response: '',
        post: '',
        responseToPost: '',
        apiResponse: "",
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);


        return body;
    };

    render() {
        return (
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
        );
    }
}

export default App;