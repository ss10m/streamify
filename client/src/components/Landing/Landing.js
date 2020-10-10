// Libraries & utils
import React from "react";

// Images
import images from "./images";

// SCSS
import "./Landing.scss";

function Landing({ session: { user }, showLogin }) {
    return (
        <div className="landing-wrapper">
            <div className="landing">
                <About user={user} showLogin={showLogin} />
                <Instructions user={user} showLogin={showLogin} />
            </div>
        </div>
    );
}

function About({ user, showLogin }) {
    return (
        <div className="landing-about">
            <div className="info">
                <h1>WELCOME TO STREAMIFY</h1>
                <h3>ABOUT</h3>
                <p>Get notified whenever a streamer you follow plays a specific game</p>
                <p>Simply follow streamer you like and the game you enjoy watching.</p>
                <h3>FEATURES</h3>
                <p>View TOP30 streamers currenly live on Twitch</p>
                <p>Most recent games played for each streamer</p>
                <p>Game follow suggestions for less active streamers</p>
                <p>Create an account to get the most out of Streamify</p>
                <p>Login as Guest to test before having to create an account</p>
            </div>
            {!user && (
                <div className="btn" onClick={showLogin}>
                    <p>LOGIN AS GUEST</p>
                </div>
            )}
        </div>
    );
}

function Instructions({ user, showLogin }) {
    const count = user ? 0 : 1;
    return (
        <div className="landing-instructions">
            <h1>HOW DOES IT WORK</h1>
            {!user && <Buttons showLogin={showLogin} />}
            <Step
                number={count + 1}
                title="FOLLOW A STREAMER"
                containsImage={true}
                src={images.follow}
            />
            <Step
                number={count + 2}
                title="FOLLOW GAMES OF YOUR CHOICE"
                containsImage={true}
                src={images.games}
            />
            <Step
                number={count + 3}
                title="GET NOTIFIED"
                containsImage={true}
                src={images.notifications}
                style={{ border: "2px solid #0d1319", marginTop: "5px" }}
            />
            <Step number={count + 4} title="ENJOY YOUR WATCH" containsImage={false} />
        </div>
    );
}

function Buttons({ showLogin }) {
    return (
        <>
            <h3>
                <span>STEP 1.</span>CREATE AN ACCOUNT
            </h3>
            <div className="inside">
                <div className="btns">
                    <div className="btn" onClick={showLogin}>
                        <p>LOGIN AS GUEST</p>
                    </div>
                    <p>OR</p>
                    <div className="btn" onClick={showLogin}>
                        <p>REGISTER</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Step({ number, title, containsImage, src, style }) {
    return (
        <>
            <h3>
                <span>STEP {number}.</span>
                {title}
            </h3>
            {containsImage && (
                <div className="inside">
                    <img src={src} style={style} alt="step" />
                </div>
            )}
        </>
    );
}

export default Landing;
