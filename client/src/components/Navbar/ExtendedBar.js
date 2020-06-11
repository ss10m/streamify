import React from "react";

import "./ExtendedBar.scss";

export default (props) => {
    console.log(props);
    return (
        <div className={"extended-bar"}>
            <div>
                <p className="link" onClick={() => console.log("link1")}>
                    Link 1
                </p>
            </div>
            <div>
                <p className="link" onClick={() => console.log("link2")}>
                    Link 2
                </p>
            </div>
            <div className="search">
                <input className="inputfield" type="number" placeholder="Order #"></input>
                <div className="user-btn wide">
                    <a href="#" class="button button-reg" onClick={props.showLogin}>
                        Search
                    </a>
                </div>
            </div>
        </div>
    );
};
