import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Search.scss";

export default () => {
    return (
        <div className="input-wrap">
            <div className="input">
                <div className="icon">
                    <FontAwesomeIcon icon="search" size="1x" />
                </div>
                <input type="text" spellCheck={false} placeholder="Search" />
            </div>
        </div>
    );
};
