import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import "./TopStreamers.scss";

class TopStreamers extends Component {
    constructor(props) {
        super(props);

        this.state = { streamers: [], width: window.innerWidth };
    }

    componentDidMount() {
        this.fetchTopStreamers();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

    fetchTopStreamers = () => {
        fetch("/api/twitchify/top")
            .then((res) => res.json())
            .then((res) => this.setState({ streamers: res["data"] }));
    };

    topStreamers = () => {
        if (this.state.width <= 650) {
            return this.state.streamers.map((streamer) => (
                <Link to={"/streamer/" + streamer["name"]} key={streamer["name"]}>
                    <div className="topStreamer">
                        <div className="logo">
                            <img src={streamer["logo"]} width="40" height="40" alt="MISSING" />
                        </div>
                    </div>
                </Link>
            ));
        } else {
            return this.state.streamers.map((streamer) => (
                <Link to={"/streamer/" + streamer["name"]} key={streamer["name"]} className="link">
                    <div className="topStreamer">
                        <div className="logo">
                            <img src={streamer["logo"]} width="40" height="40" alt="MISSING" />
                        </div>
                        <div className="info">
                            <div className="stream">
                                <div>{streamer["display_name"]}</div>
                                <div className="viewer-count">
                                    <div className="indicator"></div>
                                    <div>{streamer["viewer_count"]}</div>
                                </div>
                            </div>
                            <div className="game">{streamer["game"]}</div>
                        </div>
                    </div>
                </Link>
            ));
        }
    };

    render() {
        console.log(this.state.streamers);
        let isHidden = this.state.width > 650 ? "" : " hidden";
        console.log(isHidden);
        return <div className={"topStreamers" + isHidden}>{this.topStreamers()}</div>;
    }
}

export default withRouter(TopStreamers);
