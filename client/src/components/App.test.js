import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import { enableFetchMocks } from "jest-fetch-mock";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "icons";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

enableFetchMocks();
beforeEach(() => {
    fetch.mockClear();
    fetchMock.doMock();
});

test("app loading", () => {
    const initialState = {
        session: { isLoaded: false, user: null },
        error: { isVisible: false },
        notifications: { data: [], newNotifications: 0 },
    };

    const store = mockStore(initialState);

    const { getByText } = render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith(
        "/api/session",
        expect.objectContaining({ method: "GET" })
    );

    const linkElement = getByText(/Loading.../i);
    expect(linkElement).toBeInTheDocument();
});

test("app loads", () => {
    const initialState = {
        session: { isLoaded: true, user: null },
        error: { isVisible: false },
        notifications: { data: [], newNotifications: 0 },
    };

    const store = mockStore(initialState);
    render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );

    expect(window.fetch).toHaveBeenCalledTimes(2);
    expect(window.fetch).toHaveBeenNthCalledWith(1, "/api/twitchify/top");
    expect(window.fetch).toHaveBeenNthCalledWith(
        2,
        "/api/session",
        expect.objectContaining({ method: "GET" })
    );
});

/*
    fetch.mockResponseOnce(
        JSON.stringify({
            meta: { ok: true, message: "" },
            data: { notifications: [] },
        })
    );
    

    fetch.mockResponse((req) => {
        console.log(req.url);
        req.url === "http://myapi/"
            ? callMyApi().then((res) => "ok")
            : Promise.reject(new Error("bad url"));
    });

    fetch
        .once(
            JSON.stringify({
                meta: { ok: true, message: "" },
                data: { notifications: [] },
            })
        )
        .once(JSON.stringify({ name: "naruto" }));
    */
