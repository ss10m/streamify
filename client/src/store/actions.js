import { batch } from "react-redux";
import { parseResponse } from "helpers";

// Session Actions
export const getSession = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "GET" });
    let parsed = await parseResponse(response);
    if (!parsed) return; // show error view
    let { meta, data } = parsed;
    if (!meta.ok) return; // show error view
    let defaultState = { isLoaded: true, user: null };
    if (data["user"]) defaultState["user"] = data["user"];
    batch(() => {
        dispatch(setSession(defaultState));
        dispatch(addNotifications(data.notifications));
    });
};

const setSession = (session) => ({
    type: "SET_SESSION",
    session,
});

const clearSession = () => ({
    type: "CLEAR_SESSION",
});

// Login & Registration Actions
export const login = (userInfo) => async (dispatch) => {
    const response = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let parsed = await parseResponse(response);
    if (!parsed) return; // show error view
    let { meta, data } = parsed;
    if (!meta.ok) {
        if (meta.action) {
            return dispatch(showLoginError(meta.message));
        }
        return; // show error view
    }
    let sessionState = { isLoaded: true, user: data.user };
    batch(() => {
        dispatch(closeLoginWindow());
        dispatch(setSession(sessionState));
        dispatch(addNotifications(data.notifications));
    });
};
export const register = (userInfo) => async (dispatch) => {
    const response = await fetch("/api/users/", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let parsed = await parseResponse(response);
    if (!parsed) return; // show error view
    let { meta, data } = parsed;
    if (!meta.ok) {
        if (meta.action) {
            return dispatch(showLoginError(meta.message));
        }
        return; // show error view
    }
    console.log(data);
    let sessionState = { isLoaded: true, user: data.user };
    batch(() => {
        dispatch(closeLoginWindow());
        dispatch(setSession(sessionState));
    });
};
export const logout = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "DELETE" });
    let parsed = await parseResponse(response);
    if (!parsed) return; // show error view
    let { meta } = parsed;
    if (!meta.ok) return; // show error view;
    batch(() => {
        dispatch(clearSession());
        dispatch(clearNotifications());
    });
};
export const showLogin = () => ({
    type: "SHOW_LOGIN",
});
export const hideLogin = () => ({
    type: "HIDE_LOGIN",
});
export const showLoginError = (msg) => ({
    type: "SHOW_LOGIN_ERROR",
    msg,
});
export const hideLoginError = () => ({
    type: "HIDE_LOGIN_ERROR",
});
export const closeLoginWindow = () => (dispatch) => {
    batch(() => {
        dispatch(hideLoginError());
        dispatch(hideLogin());
    });
};

// Navbar Actions
export const toggleNavBar = () => ({
    type: "TOGGLE_NAVBAR",
});

// Search Actions
export const showSearch = () => ({
    type: "SHOW_SEARCH",
});
export const showSearchGames = (user, handleFollowChange) => ({
    type: "SHOW_SEARCH_GAMES",
    user,
    handleFollowChange,
});
export const hideSearch = () => ({
    type: "HIDE_SEARCH",
});

// Notification Actions
export const setNotifications = (notifications) => ({
    type: "SET_NOTIFICATIONS",
    notifications,
});
export const addNotifications = (notifications) => ({
    type: "ADD_NOTIFICATIONS",
    notifications,
});
export const clearNotifications = () => ({
    type: "CLEAR_NOTIFICATIONS",
});
export const clearNotificationsIndicator = () => ({
    type: "CLEAR_NOTIFICATIONS_INDICATOR",
});

// Window Size Actions
export const updateWindowSize = (width) => ({
    type: "UPDATE_WINDOW_SIZE",
    width,
});
