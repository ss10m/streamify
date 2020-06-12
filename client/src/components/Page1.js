import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Page1 extends Component {
    componentDidMount() {
        console.log("componentDidMount Page1");
    }

    getData = () => {
        let ret = [];
        for (let i = 0; i < 10; i++) {
            ret.push(<div className="box">{i}</div>);
        }
        return ret;
    };

    render() {
        let {
            session: { user },
        } = this.props;
        return (
            <div className="page1">
                <button onClick={() => this.props.history.push("/page2")}>Page 2</button>
                {this.getData()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        session: state.session,
    };
}

export default withRouter(connect(mapStateToProps)(Page1));
