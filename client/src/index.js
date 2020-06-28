import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { library } from "@fortawesome/fontawesome-svg-core";

import App from "./components/App";
import reducers from "./store/reducers.js";

import {
    faUserCircle,
    faBars,
    faEnvelope,
    faBell,
    faUser,
    faKey,
    faAt,
    faCog,
    faSignOutAlt,
    faGlobeAmericas,
    faCaretRight,
    faCaretLeft,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faUserCircle,
    faBars,
    faEnvelope,
    faBell,
    faUser,
    faKey,
    faAt,
    faCog,
    faSignOutAlt,
    faGlobeAmericas,
    faCaretRight,
    faCaretLeft,
    faSearch
);

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);

serviceWorker.unregister();
