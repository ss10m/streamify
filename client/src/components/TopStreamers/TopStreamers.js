import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./TopStreamers.scss";

class TopStreamers extends Component {
    constructor(props) {
        super(props);

        this.state = { streamers: [] };
    }

    componentDidMount() {
        this.fetchTopStreamers();
    }

    fetchTopStreamers = () => {
        fetch("api/twitchify/top")
            .then((res) => res.json())
            .then((res) => this.setState({ streamers: res["data"] }));
    };

    topStreamers = () => {
        if (1) {
            return this.state.streamers.map((streamer) => (
                <div className="topStreamer">
                    <img src={streamer["logo"]} width="40" height="40" alt="MISSING" />
                </div>
            ));
        } else {
            return this.state.streamers.map((streamer) => (
                <div className="topStreamer">
                    <img src={streamer["logo"]} width="50" height="50" alt="MISSING" />
                    {streamer.name + " " + streamer.game}
                </div>
            ));
        }
    };

    render() {
        return <div className="topStreamers hidden">{this.topStreamers()}</div>;
    }
}

export default withRouter(TopStreamers);
