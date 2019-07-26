import React, { Component } from 'react';

import logo1g from '../../images/summit1g.png';
import './streamers.css';

class Streamers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streamers: []
        };

    }

    componentDidMount() {
        var jwt = JSON.parse(localStorage.getItem("jwt"));
        console.log(jwt)
        if(jwt) {
            fetch("/api/streamers", {
                headers: {
                    Authorization: JSON.stringify(jwt.user)
                  }
            })
            .then(res => res.json())
            .then(streamers => this.setState({ streamers }));
        } else {
            console.log('not logged in');
            //redirect to login
            this.props.history.push('/');
        }

    }

    render() {

        return (
            <div>
                <ul className="stList">
                    {this.state.streamers.map(streamer =>
                        <li className="sList" key={streamer.name}>
                            <a href={'/streamer/' + streamer.name} >
                            {streamer.logo === 'default' ? (
                                <img src={logo1g} width="100" height="100" alt="MISSING" />
                            ) : (
                                <img src={streamer.logo} width="100" height="100" alt="MISSING" />
                            )}
                            <h1>{streamer.display_name}</h1>
                            <h5>{streamer.game}</h5>
                            <h6>{streamer.viewers}</h6>
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        );

    }
}


// ======================================
export default Streamers;