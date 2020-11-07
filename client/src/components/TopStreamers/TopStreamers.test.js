import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

import "icons";

import TopStreamers from "./TopStreamersContainer";

const streamers = [
    {
        id: "71588578",
        viewer_count: "128.1K",
        name: "therealknossi",
        display_name: "TheRealKnossi",
        logo:
            "https://static-cdn.jtvnw.net/jtv_user_pictures/8fb3bb16-6b9a-4d91-9161-e6b1c1b7f8ea-profile_image-300x300.png",
        game: "Special Events",
    },
    {
        id: "466082849",
        viewer_count: "80.2K",
        name: "crown",
        display_name: "Crown",
        logo:
            "https://static-cdn.jtvnw.net/jtv_user_pictures/6781c083-9dde-444d-92cd-7e7704967147-profile_image-300x300.png",
        game: "Rocket Arena",
    },
];

enableFetchMocks();
beforeEach(() => {
    fetch.mockClear();
    fetchMock.doMock();
});

test("fetches topStreamers ", async () => {
    const initialState = {
        session: { isLoaded: true, user: null },
        error: { isVisible: false },
        notifications: { data: [], newNotifications: 0 },
    };

    fetch.mockResponseOnce(
        JSON.stringify({
            meta: { ok: true, message: "" },
            data: { streamers },
        })
    );

    const store = mockStore(initialState);
    const { getByText } = render(
        <Provider store={store}>
            <BrowserRouter>
                <TopStreamers />
            </BrowserRouter>
        </Provider>
    );

    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith("/api/twitchify/top");

    await act(async () => {
        const linkElement = getByText(/TOP/i);
        expect(linkElement).toBeInTheDocument();
    });
});

/*
let container;

beforeEach(() => {
    enableFetchMocks();
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

test("can render and update a counter", async () => {
    // Test first render and effect

    const initialState = {
        session: { isLoaded: true, user: null },
        error: { isVisible: false },
        notifications: { data: [], newNotifications: 0 },
    };

    fetch.mockResponseOnce(
        JSON.stringify({
            meta: { ok: true, message: "" },
            data: { streamers },
        })
    );

    const store = mockStore(initialState);
    await act(async () => {
        ReactDOM.render(
            <Provider store={store}>
                <BrowserRouter>
                    <TopStreamers />
                </BrowserRouter>
            </Provider>,
            container
        );
    });
    expect(window.fetch).toHaveBeenCalledTimes(1);
    const label = container.querySelector(".top-streamers").innerHTML;

    
    const button = container.querySelector("button");
    const label = container.querySelector("p");
    expect(label.textContent).toBe("You clicked 0 times");
    expect(document.title).toBe("You clicked 0 times");
    

    // Test second render and effect
    
    act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    
    expect(label.textContent).toBe("You clicked 1 times");
    expect(document.title).toBe("You clicked 1 times");
    
});
*/
