// Libraries & utils
import React from "react";

// SCSS
import "./Error.scss";

export default (props) => {
    return (
        <div className="error">
            <p>{props.error || "Something went wrong"}</p>
        </div>
    );
};
