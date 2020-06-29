//import { v4 as uuidv4 } from "uuid";
import { combineReducers } from "redux";

const SET_SESSION = "SET_SESSION";
const CLEAR_SESSION = "CLEAR_SESSION";
const defaultState = { isLoaded: false, user: null };

const sessionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SESSION:
            return action.session;
        case CLEAR_SESSION:
            return { isLoaded: true, user: null };
        default:
            return state;
    }
};

const SHOW_LOGIN_ERROR = "SHOW_LOGIN_ERROR";
const HIDE_LOGIN_ERROR = "HIDE_LOGIN_ERROR";

const loginErrorReducer = (state = "", action) => {
    switch (action.type) {
        case SHOW_LOGIN_ERROR:
            return action.msg;
        case HIDE_LOGIN_ERROR:
            return "";
        default:
            return state;
    }
};

const SHOW_LOGIN = "SHOW_LOGIN";
const HIDE_LOGIN = "HIDE_LOGIN";

const showLoginReducer = (state = false, action) => {
    switch (action.type) {
        case SHOW_LOGIN:
            return true;
        case HIDE_LOGIN:
            return false;
        default:
            return state;
    }
};

const TOGGLE_NAVBAR = "TOGGLE_NAVBAR";

const toggleNavbarReducer = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_NAVBAR:
            return !state;
        default:
            return state;
    }
};

export default combineReducers({
    session: sessionReducer,
    loginError: loginErrorReducer,
    loginDisplayed: showLoginReducer,
    toggleNavbar: toggleNavbarReducer,
});
