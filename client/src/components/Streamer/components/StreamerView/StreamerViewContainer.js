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
        let { streamer } = this.props;
        return <StreamerView streamer={streamer} unfollowGame={this.unfollowGame} />;
    }
}

export default StreamerViewContainer;
