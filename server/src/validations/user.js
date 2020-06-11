import Joi from "joi";

const email = Joi.string()
    .email()
    .required()
    .max(50)
    .error(() => {
        return {
            message: "Email address is not valid",
        };
    });

const username = Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .required()
    .error(() => {
        return {
            message: "Username must be at least 4 alphanumeric characters long",
        };
    });

const password = Joi.string()
    .regex(/^[^\s\\]{8,30}$/)
    .required()
    .error(() => {
        return {
            message: "Password must be at least 8 characters long",
        };
    });

const confirmPassword = Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .error(() => {
        return {
            message: "Passwords do not match",
        };
    });

export const signUp = Joi.object().keys({
    username,
    email,
    password,
    confirmPassword,
});

export const signIn = Joi.object().keys({
    username,
    password,
});
