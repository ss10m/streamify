import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Input.scss";

export default (props) => {
    const activeClass = props.value.length > 0 ? " active" : "";
    return (
        <div className="input">
            <div className="icon">
                <FontAwesomeIcon icon={props.icon} size="1x" />
            </div>
            <div className={"field" + activeClass}>
                <label>
                    <input
                        type={props.type || "text"}
                        value={props.value}
                        onChange={(e) => props.onChangeValue(e)}
                        onKeyPress={props.onKeyPress}
                        spellCheck={false}
                        autoFocus={props.autoFocus}
                    />
                    <span className="title">{props.title}</span>
                </label>
            </div>
        </div>
    );
};
