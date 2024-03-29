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

const SHOW_SEARCH = "SHOW_SEARCH";
const SHOW_SEARCH_GAMES = "SHOW_SEARCH_GAMES";
const HIDE_SEARCH = "HIDE_SEARCH";
const SEARCH_USERS = "USERS";
const SEARCH_GAMES = "GAMES";

const showSearchReducer = (state = false, action) => {
    switch (action.type) {
        case SHOW_SEARCH:
            return { type: SEARCH_USERS };
        case SHOW_SEARCH_GAMES:
            return {
                type: SEARCH_GAMES,
                user: action.user,
                handleFollowChange: action.handleFollowChange,
            };
        case HIDE_SEARCH:
            return false;
        default:
            return state;
    }
};

const ADD_NOTIFICATIONS = "ADD_NOTIFICATIONS";
const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";
const CLEAR_NOTIFICATIONS_INDICATOR = "CLEAR_NOTIFICATIONS_INDICATOR";

const notificationsReducer = (
    state = { data: [], newNotifications: 0 },
    action
) => {
    switch (action.type) {
        case ADD_NOTIFICATIONS:
            return {
                data: [...action.notifications, ...state.data],
                newNotifications: action.notifications.length,
            };
        case SET_NOTIFICATIONS:
            return { data: [...action.notifications], newNotifications: 0 };
        case CLEAR_NOTIFICATIONS_INDICATOR:
            return { data: [...state.data], newNotifications: 0 };
        case CLEAR_NOTIFICATIONS:
            return { data: [], newNotifications: 0 };
        default:
            return state;
    }
};

const UPDATE_WINDOW_SIZE = "UPDATE_WINDOW_SIZE";

const windowSizeReducer = (state = 0, action) => {
    switch (action.type) {
        case UPDATE_WINDOW_SIZE:
            return action.width;
        default:
            return state;
    }
};

const SET_ERROR = "SET_ERROR";

const errorReducer = (state = { isVisible: false, message: "" }, action) => {
    switch (action.type) {
        case SET_ERROR:
            return { isVisible: true, message: action.message };
        default:
            return state;
    }
};

export default combineReducers({
    session: sessionReducer,
    loginError: loginErrorReducer,
    loginDisplayed: showLoginReducer,
    toggleNavbar: toggleNavbarReducer,
    searchDisplayed: showSearchReducer,
    notifications: notificationsReducer,
    windowSize: windowSizeReducer,
    error: errorReducer,
});
