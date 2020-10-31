import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import TopStreamers from "./TopStreamers";

test("renders ", () => {
    let streamers = [
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
    const { getByText } = render(
        <BrowserRouter>
            <TopStreamers streamers={streamers} />
        </BrowserRouter>
    );
    const linkElement = getByText(/TOP STREAMERS/i);
    console.log(linkElement);
    expect(linkElement).toBeInTheDocument();
});
