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
        fetch("/api/streamers")
            .then(res => res.json())
            .then(streamers => this.setState({ streamers }));
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