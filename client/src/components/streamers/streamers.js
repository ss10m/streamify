import React, { Component } from 'react';

import logo1g from '../../images/summit1g.png';
import './streamers.css';
import { withRouter, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class Streamers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streamers: []
        };

    }

    componentDidMount() {
        const jwt = this.props.session;
        if(jwt) {
            fetch("/api/streamers", {
                headers: {
                    Authorization: JSON.stringify(jwt)
                }
            })
            .then(res => res.json())
            .then(streamers => this.setState({ streamers }));
        }

    }

    getStreamers() {
        return (
            <ul className="stList">
                {this.state.streamers.map(streamer =>
                    <li className="sList" key={streamer.name}>
                        <Link to={'/streamer/' + streamer.name} className="nav-link">
                            {streamer.logo === 'default' ? (
                                <img src={logo1g} width="100" height="100" alt="MISSING" />
                            ) : (
                                <img src={streamer.logo} width="100" height="100" alt="MISSING" />
                            )}
                            <h1>{streamer.display_name}</h1>
                            <h5>{streamer.game}</h5>
                            <h6>{streamer.viewers}</h6>
                        </Link>
                    </li>
                )}
            </ul>
        )
    }

    getLoginButton() {
        return (
            <Button variant="primary" size="lg" onClick={this.props.modalOpen}>
                Log in to see followed channels
            </Button>
        )
    }

    render() {
        const isLoggedIn = this.props.session;
        let body;

        if(isLoggedIn) {
            body = this.getStreamers()
        } else {
            body = this.getLoginButton()
        }

        return (
            <div>
                {body}
            </div>
        );

    }
}


// ======================================
export default Streamers;