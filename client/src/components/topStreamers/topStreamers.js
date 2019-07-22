import React, { Component } from 'react';

import './topStreamers.css'

class TopStreamers extends Component {
    state = {
        topStreamers: []
    };

    componentDidMount() {
        fetch("/api/topStreamers")
            .then(res => res.json())
            .then(streamers => this.setState({ topStreamers : streamers }));
    }

    sidebar = () => {
        return (
            <div>
                {this.state.topStreamers.map(streamer =>
                    <a href={"/streamer/" + streamer['name']} key={streamer['name']} className="topStreamers list-group-item py-1 list-group-item-action flex-column align-items-start border-0">
                        <div className="d-flex">
                            <img className ='topStreamers' src={streamer['logo']} width="25" height="25" alt="MISSING" />
                            &nbsp;&nbsp;
                            <h7 className="names">{streamer['display_name']}</h7>  
                        </div>
                        <div>
                            <small className='text-white-50'>{streamer['game']}</small>
                            <span style={{ float: 'right'}} className="badge badge-danger">{streamer['viewers']}</span>
                        </div>
                    </a>
                )}
            </div>
        );
    };

    render() {

        return (
            <div className="topStreamers list-group list-group-flush">
                {this.sidebar()}
            </div>
        );
    }
}

// ======================================
export default TopStreamers;