import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import TopStreamers from "./TopStreamers";

const MIN_WIN_SIZE = 992;

class TopStreamersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamers: [], width: window.innerWidth, isMinimized: false };
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

    toggleSideBar = () => {
        this.setState((prevState) => ({
            isMinimized: !prevState.isMinimized,
        }));
    };

    render() {
        let isHidden = this.state.width <= MIN_WIN_SIZE;
        return <TopStreamers {...this.state} isHidden={isHidden} toggleSideBar={this.toggleSideBar} />;
    }
}

export default withRouter(TopStreamersContainer);
