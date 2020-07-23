import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { showLogin, showSearch } from "store/actions.js";

import { dateDifference } from "helpers";

import Streamers from "./Streamers";

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

        try {
            let data = await response.json();
            if (response.ok) {
                return this.setState({ streamers: data, loading: false });
            }
            console.log(data.message || "Something went wrong.");
        } catch (err) {
            console.log("Something went wrong.");
        }
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
            <div className="followed">
                <Streamers
                    user={user}
                    streamers={streamers}
                    dateDifference={dateDifference}
                    showLogin={showLogin}
                    showSearch={showSearch}
                    width={windowSize}
                    loading={loading}
                />
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StreamersContainer));
