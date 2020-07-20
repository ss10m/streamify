import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { showLogin, showSearch } from "../../store/actions.js";

import { dateDifference } from "../../helpers";

import Streamers from "./Streamers";

import "./Streamers.scss";

class StreamersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { streamers: [], width: window.innerWidth, loading: true };
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.getStreamersData();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth });
    };

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
        } = this.props;
        let { streamers, width, loading } = this.state;
        return (
            <div className="followed">
                <Streamers
                    user={user}
                    streamers={streamers}
                    dateDifference={dateDifference}
                    showLogin={showLogin}
                    showSearch={showSearch}
                    width={width}
                    loading={loading}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
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
