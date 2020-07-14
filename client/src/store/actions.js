const setSession = (session) => ({
    type: "SET_SESSION",
    session,
});

const clearSession = () => ({
    type: "CLEAR_SESSION",
});

export const getSession = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "GET" });
    let data = await extractData(response, dispatch);
    let defaultState = { isLoaded: true, user: null };
    if (data && data["user"]) defaultState["user"] = data["user"];
    dispatch(setSession(defaultState));
    dispatch(addNotifications(data.notifications));
};

export const login = (userInfo) => async (dispatch) => {
    const response = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let data = await extractData(response, dispatch);
    if (!data) return;
    let sessionState = { isLoaded: true, user: data.user };
    dispatch(closeLoginWindow());
    dispatch(setSession(sessionState));
    dispatch(addNotifications(data.notifications));
};

export const register = (userInfo) => async (dispatch) => {
    const response = await fetch("/api/users/", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    });

    let data = await extractData(response, dispatch);
    if (!data) return;
    let sessionState = { isLoaded: true, user: data };
    dispatch(closeLoginWindow());
    dispatch(setSession(sessionState));
    dispatch(clearNotifications());
};

export const logout = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "DELETE" });
    if (!response.ok) console.log("ERROR");
    dispatch(clearSession());
    dispatch(clearNotifications());
};

const extractData = async (response, dispatch) => {
    try {
        let data = await response.json();
        if (response.ok) {
            return data;
        }
        dispatch(showLoginError(data.message || "Something went wrong."));
    } catch (err) {
        dispatch(showLoginError("Something went wrong."));
    }
};

export const showLoginError = (msg) => ({
    type: "SHOW_LOGIN_ERROR",
    msg,
});

export const hideLoginError = () => ({
    type: "HIDE_LOGIN_ERROR",
});

export const closeLoginWindow = () => (dispatch) => {
    dispatch(hideLoginError());
    dispatch(hideLogin());
};

export const showLogin = () => ({
    type: "SHOW_LOGIN",
});

export const hideLogin = () => ({
    type: "HIDE_LOGIN",
});

export const toggleNavBar = () => ({
    type: "TOGGLE_NAVBAR",
});

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

export const addNotifications = (notifications) => ({
    type: "ADD_NOTIFICATIONS",
    notifications,
});

export const clearNotifications = () => ({
    type: "CLEAR_NOTIFICATIONS",
});
