// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";

// Components
import TopStreamers from "./TopStreamers";

// Helpers
import { parseResponse } from "helpers";

const MIN_WIN_SIZE = 992;

class TopStreamersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamers: [], isLoaded: false, isMinimized: false };
    }

    componentDidMount() {
        this.fetchTopStreamers();
    }

    fetchTopStreamers = async () => {
        const response = await fetch("/api/twitchify/top");
        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;
        if (!meta.ok) return;
        this.cacheImages(data.streamers);
    };

    cacheImages = (streamers) => {
        let totalImages = streamers.length;
        let cachedImages = 0;

        const cacheImage = (streamer) => {
            const image = new window.Image();
            image.onload = () => {
                streamer.img = image;
                cachedImages++;

                if (cachedImages === totalImages) {
                    this.setState({ streamers, isLoaded: true });
                }
            };
            image.src = streamer.logo;
        };
        streamers.forEach((streamer) => cacheImage(streamer));
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
