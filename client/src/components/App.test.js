import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import configureStore from "redux-mock-store";
import App from "./App";

const mockStore = configureStore();
/*
test("renders learn react link", () => {
    const initialState = { isLoaded: true, user: null };
    const store = mockStore(initialState);
    const { getByText } = render(
        <Provider store={store}>
            <App />
        </Provider>
    );
    const linkElement = getByText(/server msg/i);
    expect(linkElement).toBeInTheDocument();
});


test("renders ", () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/username/i);
    expect(linkElement).toBeInTheDocument();
});

test("ExampleComponent", () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/username/i);
    expect(linkElement).toBeInTheDocument();
});
*/
