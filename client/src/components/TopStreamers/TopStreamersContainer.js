// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";

// Config
import { API_URL } from "config";

// Helpers
import { parseResponse } from "helpers";

// Components
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

    fetchTopStreamers = async () => {
        const response = await fetch(`${API_URL}/api/twitchify/top`);
        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;
        if (!meta.ok) return;
        this.setState({ streamers: data.streamers });
    };

    toggleSideBar = () => {
        this.setState((prevState) => ({
            isMinimized: !prevState.isMinimized,
        }));
    };

    render() {
        let isHidden = this.props.windowSize <= MIN_WIN_SIZE;
        return (
            <TopStreamers
                {...this.state}
                isHidden={isHidden}
                toggleSideBar={this.toggleSideBar}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        windowSize: state.windowSize,
    };
};

export default connect(mapStateToProps)(TopStreamersContainer);
