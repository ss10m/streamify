// Libraries & utils
import React, { Component } from "react";
import ReactDOM from "react-dom";

// SCSS
import "./FollowModal.scss";

class FollowModal extends Component {
    componentDidMount() {
        document.addEventListener("click", this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClickOutside, true);
    }

    handleClickOutside = (event) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.close();
        }
    };

    render() {
        let { streamer, follow, close } = this.props;
        return (
            <div className="prompt-container">
                <div className="prompt">
                    <p>YOU MUST FIRST FOLLOW</p>
                    <div className="streamer-info">
                        <img
                            src={streamer["logo"]}
                            width="50"
                            height="50"
                            alt="MISSING"
                        />
                        <p>{streamer.display_name}</p>
                    </div>
                    <div className="btns">
                        <button onClick={follow}>FOLLOW</button>
                        <button onClick={close}>CANCEL</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FollowModal;
