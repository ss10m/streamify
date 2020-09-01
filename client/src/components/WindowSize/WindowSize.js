// Libraries & utils
import { Component } from "react";

// Redux
import { connect } from "react-redux";
import { updateWindowSize } from "store/actions.js";

class WindowSize extends Component {
    componentDidMount() {
        this.props.updateWindowSize(window.innerWidth);
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.props.updateWindowSize(window.innerWidth);
    };

    render() {
        return null;
    }
}

const mapDispatchToProps = (dispatch) => ({
    updateWindowSize: (width) => {
        dispatch(updateWindowSize(width));
    },
});

export default connect(null, mapDispatchToProps)(WindowSize);
