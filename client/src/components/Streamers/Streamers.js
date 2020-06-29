import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

import { showLogin } from "../../store/actions.js";

import "./Streamers.scss";

class Streamers extends Component {
    constructor(props) {
        super(props);

        this.state = { streamers: [] };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.session !== prevProps.session) {
            this.getStreamersData();
            this.setState({ streamers: [] });
        }
    }

    getStreamersData = async () => {
        const response = await fetch("/api/twitchify/streamers", {});

        try {
            let data = await response.json();
            if (response.ok) {
                return this.setState({ streamers: data });
            }
            console.log(data.message || "Something went wrong.");
        } catch (err) {
            console.log("Something went wrong.");
        }
    };

    getStreamers = () => {
        return this.state.streamers.map((streamer) => (
            <Link to={"/streamer/" + streamer["name"]} key={streamer["name"]} className="followed-streamer ">
                <img src={streamer["logo"]} width="60" height="60" alt="MISSING" />
                <div>{streamer["display_name"]}</div>
                <div>{dateDifference(new Date(streamer["followed_at"]), new Date())}</div>
            </Link>
        ));
    };

    render() {
        let {
            session: { user },
        } = this.props;

        if (!user) {
            return (
                <div className="unauth">
                    <p>Log In to see followed streamers.</p>
                    <button onClick={this.props.showLogin}>Sign In</button>
                </div>
            );
        }
        return <div className="followed">{this.getStreamers()}</div>;
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
});

const dateDifference = (then, now) => {
    let offset = (now - then) / 1000;
    let delta_s = parseInt(offset % 60);
    offset /= 60;
    let delta_m = parseInt(offset % 60);
    offset /= 60;
    let delta_h = parseInt(offset % 24);
    offset /= 24;
    let delta_d = parseInt(offset);

    if (delta_d > 365) {
        let years = parseInt(delta_d / 365);
        let plural = years > 1 ? "s" : "";
        return `${years} year${plural} ago`;
    }
    if (delta_d > 30) {
        let months = parseInt(delta_d / 30);
        let plural = months > 1 ? "s" : "";
        return `${months} month${plural} ago`;
    }
    if (delta_d > 0) {
        let plural = delta_d > 1 ? "s" : "";
        return `${delta_d} day${plural} ago`;
    }
    if (delta_h > 0) {
        let plural = delta_h > 1 ? "s" : "";
        return `${delta_h} hour${plural} ago`;
    }
    if (delta_m > 0) {
        let plural = delta_m > 1 ? "s" : "";
        return `${delta_m} minute${plural} ago`;
    }
    if (delta_s > 10) {
        return `${delta_s} seconds ago`;
    } else {
        return "just now";
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Streamers));
