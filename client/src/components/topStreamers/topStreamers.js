import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './topStreamers.css'

class TopStreamers extends Component {
    constructor() {
        super();
        this.state = { 
            topStreamers: [],
        };
    }

    componentDidMount() {
        this.fetchTopStreamers();
        this.topStreamersID = setInterval(
            () => this.fetchTopStreamers(),
            35000
        );
    }

    componentWillUnmount() {
        clearInterval(this.state.topStreamersID);
        window.removeEventListener("resize", this.handleResize);
    }

    fetchTopStreamers() {
        console.log('updating top streamers')
        fetch("/api/topStreamers")
            .then(res => res.json())
            .then(streamers => this.setState({ topStreamers : streamers }));
    }

    sidebar = () => {
        if(window.innerWidth > 800) {
            return (
                <div className="topStreamers list-group list-group-flush">
                    {this.state.topStreamers.map(streamer =>
                        <Link to={"/streamer/" + streamer['name']} key={streamer['name']} className="topS nav-link topStreamers list-group-item py-1 list-group-item-action flex-column align-items-start border-0">
                            <div className="d-flex">
                                <img className ='topStreamersImg' src={streamer['logo']} width="25" height="25" alt="MISSING" />
                                &nbsp;&nbsp;
                                <small className="names">{streamer['display_name']}</small>  
                            </div>
                            <div>
                                <small className='text-white-50'>{streamer['game']}</small>
                                <span style={{ float: 'right'}} className="badge badge-danger">{streamer['viewers']}</span>
                            </div>
                        </Link>
                    )}
                </div>
            );
        } else {
            return (
                <div className="topStreamersMini listMini list-group-flush">
                    {this.state.topStreamers.map(streamer =>
                        <Link to={"/streamer/" + streamer['name']} key={streamer['name']} className="topStreamersMini topStreamers nav-link  list-group-item py-1 list-group-item-action flex-column align-items-start border-0">
                            <div className="d-flex">
                                <img className="topStreamersImg" src={streamer['logo']} width="40" height="40" alt="MISSING" />
                            </div>
                        </Link>
                    )}
                </div>
            );
        }

    };

    render() {
        return (
            <div>
                {this.sidebar()}
            </div>
        );
    }
}

// ======================================
export default TopStreamers;