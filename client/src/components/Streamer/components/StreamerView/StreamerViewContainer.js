// Libraries & utils
import React, { Component } from "react";

// Components
import StreamerView from "./StreamerView";

// Helpers
import { UNFOLLOW_GAME } from "helpers";

class StreamerViewContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { previewLoaded: false };
    }

    unfollowGame = (game) => {
        this.props.handleFollowChange(UNFOLLOW_GAME, game);
    };

    render() {
        let { width, streamer } = this.props;
        let { previewLoaded } = this.state;
        let previewWidth = Math.max(280, Math.min(width - 90, 450));

        return (
            <StreamerView
                streamer={streamer}
                previewLoaded={previewLoaded}
                previewWidth={previewWidth}
                unfollowGame={this.unfollowGame}
                onPreviewLoad={() => this.setState({ previewLoaded: true })}
            />
        );
    }
}

export default StreamerViewContainer;
