import React, { Component } from 'react';

//import logo1g from '../../images/summit1g.png';
import './streamers.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

class Streamers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streamers: []
        };

    }

    componentDidUpdate(prevProps, prevState) {
        console.log('componentDidUpdate')
        if(prevProps.session !== this.props.session) {
            const jwt = this.props.session;
            if(jwt) {
                fetch("/api/streamers", {
                    headers: {
                        Authorization: JSON.stringify(jwt)
                    }
                })
                .then(res => res.json())
                .then(streamers => {
                    streamers = JSON.parse(streamers);
                    this.setState({ streamers })
                });
            }
        }
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
            .then(streamers => {
                streamers = JSON.parse(streamers);
                this.setState({ streamers })
            }).catch(err => {
                console.log(err)
            })
        }

    }

    getStreamers() {
        return (
            <div className="streamerListWrapper">
                {this.state.streamers.map(streamer =>
                    <div className="streamerList" key={streamer.name}>
                        <Link to={'/streamer/' + streamer.name} className="nav-link">
                            <img src={streamer.logo} width="100" height="100" alt="MISSING" />
                            <h1>{streamer.display_name}</h1>
                            <h5>{streamer.game}</h5>
                            <h6>{streamer.viewers}</h6>
                        </Link>
                    </div>
                )}
            </div>
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
            <div className="streamersBody">
                <h1>FILTER (LIVE, OFFLINE, > viewers)</h1>
                {body}
            </div>
        );

    }
}

// ======================================
export default Streamers;