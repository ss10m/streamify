import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import "./Streamer.scss";

class Streamer extends Component {
    constructor(props) {
        super(props);

        this.state = { data: {} };
    }

    componentDidMount() {
        this.getStreamersData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            console.log("ids dont match");
            this.getStreamersData();
        }
    }

    getStreamersData = (username) => {
        fetch("/api/twitchify/streamer/" + this.props.match.params.id, {})
            .then((res) => res.json())
            .then((res) => {
                if (res.error) {
                    throw res;
                }
                return res;
            })
            .then((data) => {
                this.setState({ data: data.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        let {
            session: { user },
        } = this.props;

        return (
            <div className="tst">
                <div>{this.props.match.params.id}</div>
                <div>{(user && user.username) || "not logged in"}</div>

                <div>{JSON.stringify(this.state.data)}</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        session: state.session,
        Streamer,
    };
}

export default withRouter(connect(mapStateToProps)(Streamer));
