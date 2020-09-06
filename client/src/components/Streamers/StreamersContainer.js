// Libraries & utils
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { showLogin, showSearch } from "store/actions.js";

// Components
import Streamers from "./Streamers";

// Helpers
import { dateDifference, parseResponse } from "helpers";

// SCSS
import "./Streamers.scss";

class StreamersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamers: [], loading: true };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.session !== prevProps.session) {
            this.getStreamersData();
            this.setState({ streamers: [], loading: true });
        }
    }

    getStreamersData = async () => {
        const response = await fetch("/api/twitchify/streamers", {});
        let parsed = await parseResponse(response);
        if (!parsed) return;
        let { meta, data } = parsed;
        if (!meta.ok) return;
        this.setState({ streamers: data.followed, loading: false });
    };

    render() {
        let {
            session: { user },
            showLogin,
            showSearch,
            windowSize,
        } = this.props;
        let { streamers, loading } = this.state;
        return (
            <Streamers
                user={user}
                streamers={streamers}
                dateDifference={dateDifference}
                showLogin={showLogin}
                showSearch={showSearch}
                width={windowSize}
                loading={loading}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        windowSize: state.windowSize,
    };
};

const mapDispatchToProps = (dispatch) => ({
    showLogin: () => {
        dispatch(showLogin());
    },
    showSearch: () => {
        dispatch(showSearch());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamersContainer);
