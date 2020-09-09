// Libraries & utils
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducers from "./store/reducers.js";

// Components
import App from "./components/App";

// Icons
import { library } from "@fortawesome/fontawesome-svg-core";
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
    faTimes,
    faUsers,
    faTrash,
    faTrashAlt,
    faUserPlus,
    faPlay,
    faEye,
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
    faSearch,
    faTimes,
    faUsers,
    faTrash,
    faTrashAlt,
    faUserPlus,
    faPlay,
    faEye
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
