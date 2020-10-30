// Libraries & utils
import React from "react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// SCSS
import "./LoginPage.scss";

const LoginPage = (props) => {
    return (
        <div className="login-page" onClick={props.handleClickOutside}>
            <div className="login-box">
                <div className="login-header">{props.title}</div>
                {props.loginError && (
                    <div className="error-msg center">
                        <p>{props.loginError}</p>
                    </div>
                )}
                <div className="login-body">
                    <View {...props} />
                </div>
                <hr className="divider" />
                <div className="login-footer">
                    <div>
                        <p>Terms of Service</p>
                    </div>
                    <div>
                        <p>Privacy Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const View = (props) => {
    switch (props.view) {
        case "login":
            return <LoginView {...props} />;
        case "register":
            return <RegistrationView {...props} />;
        default:
            return <DefaultView {...props} />;
    }
};

const DefaultView = (props) => {
    return (
        <>
            <div className="top center">
                <FontAwesomeIcon icon="user-circle" size="10x" />
            </div>
            <div className="btn login center" onClick={() => props.switchView("login")}>
                LOGIN
            </div>
            <div className="btn guest center" onClick={props.loginAsGuest}>
                LOGIN AS GUEST
            </div>
            <div className="btn register center" onClick={() => props.switchView("register")}>
                CREATE ACCOUNT
            </div>
        </>
    );
};

const LoginView = (props) => {
    return (
        <>
            <div className="top center">
                <Input
                    title="Username"
                    icon="user"
                    value={props.username}
                    onChangeValue={props.handleInput("username")}
                    onKeyPress={props.handleKeyPress(props.login)}
                    autoFocus={true}
                />
                <Input
                    title="Password"
                    icon="key"
                    type="password"
                    value={props.password}
                    onChangeValue={props.handleInput("password")}
                    onKeyPress={props.handleKeyPress(props.login)}
                />
            </div>
            <div className="btn login center" onClick={props.login}>
                LOGIN
            </div>
            <div className="btn cancel center" onClick={() => props.switchView("default")}>
                CANCEL
            </div>
        </>
    );
};

const RegistrationView = (props) => {
    return (
        <>
            <div className="top center">
                <Input
                    title="Username"
                    icon="user"
                    value={props.username}
                    onChangeValue={props.handleInput("username")}
                    onKeyPress={props.handleKeyPress(props.register)}
                    autoFocus={true}
                />
                <Input
                    title="Email"
                    icon="at"
                    value={props.email}
                    onChangeValue={props.handleInput("email")}
                    onKeyPress={props.handleKeyPress(props.register)}
                />
                <Input
                    title="Password"
                    icon="key"
                    type="password"
                    value={props.password}
                    onChangeValue={props.handleInput("password")}
                    onKeyPress={props.handleKeyPress(props.register)}
                />
                <Input
                    title="Confirm Password"
                    icon="key"
                    type="password"
                    value={props.confirmPassword}
                    onChangeValue={props.handleInput("confirmPassword")}
                    onKeyPress={props.handleKeyPress(props.register)}
                />
            </div>
            <div className="btn login center" onClick={props.register}>
                CREATE ACCOUNT
            </div>
            <div className="btn cancel center" onClick={() => props.switchView("default")}>
                CANCEL
            </div>
        </>
    );
};

const Input = (props) => {
    const activeClass = props.value.length > 0 ? " active" : "";
    return (
        <div className="input">
            <div className="icon">
                <FontAwesomeIcon icon={props.icon} size="1x" />
            </div>
            <div className={"field" + activeClass}>
                <label>
                    <input
                        type={props.type || "text"}
                        value={props.value}
                        onChange={(e) => props.onChangeValue(e)}
                        onKeyPress={props.onKeyPress}
                        spellCheck={false}
                        autoFocus={props.autoFocus}
                    />
                    <span className="title">{props.title}</span>
                </label>
            </div>
        </div>
    );
};

export default LoginPage;
