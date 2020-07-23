import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import TopStreamers from "./TopStreamers";

const MIN_WIN_SIZE = 992;

class TopStreamersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamers: [], isMinimized: false };
    }

    componentDidMount() {
        this.fetchTopStreamers();
    }

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
        let isHidden = this.props.windowSize <= MIN_WIN_SIZE;
        return <TopStreamers {...this.state} isHidden={isHidden} toggleSideBar={this.toggleSideBar} />;
    }
}

const mapStateToProps = (state) => {
    return {
        windowSize: state.windowSize,
    };
};

export default withRouter(connect(mapStateToProps)(TopStreamersContainer));
