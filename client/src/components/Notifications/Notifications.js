// Libraries & utils
import React, { Component } from "react";
import socketIO from "socket.io-client";
import { Helmet } from "react-helmet";

//Redux
import { connect } from "react-redux";
import { addNotifications } from "store/actions.js";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = { socket: null };
    }

    componentDidMount() {
        let { session } = this.props;
        console.log(session);
        if (session.user) {
            this.connectSocket();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let { session } = this.props;
        let { socket } = this.state;

        if (session !== prevProps.session) {
            if (session.user) {
                this.connectSocket();
            }

            if (!session.user && socket) {
                socket.disconnect();
                this.setState({ socket: null });
            }
        }
    }

    connectSocket = () => {
        let socket = socketIO.connect();
        socket.on("notification", this.handleNotification);
        this.setState({ socket });
    };

    handleNotification = (data) => {
        this.props.addNotifications(data);
    };

    render() {
        let { newNotifications } = this.props.notifications;
        let title = "Streamify";
        if (newNotifications) {
            title = `(${newNotifications}) Streamify`;
        }

        return (
            <Helmet>
                <title>{title}</title>
            </Helmet>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        notifications: state.notifications,
    };
};

const mapDispatchToProps = (dispatch) => ({
    addNotifications: (notifications) => {
        dispatch(addNotifications(notifications));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
