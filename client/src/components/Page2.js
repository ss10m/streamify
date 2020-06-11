import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Page2 extends Component {
    componentDidMount() {
        console.log("componentDidMount Page2");
    }

    render() {
        let {
            session: { user },
        } = this.props;
        console.log(this.props.session);
        return (
            <div className="page2">
                <div>Page 2</div>
                <div>{user ? user.username : "not logged in"}</div>
                <button onClick={() => this.props.history.push("")}>Page 1</button>
                <input style={{ marginBottom: "50px" }} type="text" className="form-control" name="username" />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

export default withRouter(connect(mapStateToProps)(Page2));
