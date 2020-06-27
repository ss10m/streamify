import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import "./TopStreamers.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TopStreamers extends Component {
    constructor(props) {
        super(props);

        this.state = { streamers: [], width: window.innerWidth, isHidden: false };
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
        let { width, isHidden } = this.state;
        if (width <= 992 || isHidden) {
            return topStreamersHidden(this.state.streamers);
        } else {
            return topStreamers(this.state.streamers);
        }
    };

    getHeader = () => {
        let { width, isHidden } = this.state;
        if (width <= 992) {
            return (
                <div className="toggle">
                    <p>TOP</p>
                </div>
            );
        } else if (isHidden) {
            return (
                <div className="toggle">
                    <FontAwesomeIcon className="icon" icon="caret-right" size="2x" onClick={this.toggleSideBar} />
                </div>
            );
        } else {
            return (
                <div className="toggle expanded">
                    <p>TOP STREAMERS</p>
                    <FontAwesomeIcon className="icon" icon="caret-left" size="2x" onClick={this.toggleSideBar} />
                </div>
            );
        }
    };

    toggleSideBar = () => {
        this.setState((prevState) => ({
            isHidden: !prevState.isHidden,
        }));
    };

    render() {
        let { width, isHidden } = this.state;
        return (
            <div className={"topStreamers" + (width <= 992 || isHidden ? " hidden" : "")}>
                {this.getHeader()}
                {this.topStreamers()}
            </div>
        );
    }
}

const topStreamers = (streamers) => {
    return streamers.map((streamer) => (
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
};

const topStreamersHidden = (streamers) => {
    return streamers.map((streamer) => (
        <Link to={"/streamer/" + streamer["name"]} key={streamer["name"]}>
            <div className="topStreamer">
                <div className="logo">
                    <img src={streamer["logo"]} width="40" height="40" alt="MISSING" />
                </div>
            </div>
        </Link>
    ));
};

export default withRouter(TopStreamers);
