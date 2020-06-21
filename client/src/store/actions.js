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
    return dispatch(setSession(defaultState));
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
    let sessionState = { isLoaded: true, user: data };
    dispatch(closeLoginWindow());
    return dispatch(setSession(sessionState));
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
    return dispatch(setSession(sessionState));
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

export const logout = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "DELETE" });
    if (!response.ok) console.log("ERROR");
    return dispatch(clearSession());
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
