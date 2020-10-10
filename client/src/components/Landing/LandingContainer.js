// Libraries & utils
import React from "react";

// Redux
import { connect } from "react-redux";
import { showLogin } from "store/actions.js";

// Components
import Landing from "./Landing";

class LandingContainer extends React.Component {
    render() {
        let { session, showLogin } = this.props;
        return <Landing session={session} showLogin={showLogin} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
