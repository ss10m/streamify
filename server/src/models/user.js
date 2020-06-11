/*
import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            validate: {
                validator: (username) => User.doesNotExist({ username }),
                message: "Username already exists",
            },
        },
        email: {
            type: String,
            validate: {
                validator: (email) => User.doesNotExist({ email }),
                message: "Email already exists",
            },
        },
        password: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
        },
        hash: {
            type: String,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", function () {
    if (this.isModified("password")) {
        let salt = crypto.randomBytes(16).toString("hex");
        let hash = crypto.pbkdf2Sync(this.password, salt, 10000, 512, "sha512").toString("hex");

        this.salt = salt;
        this.hash = hash;
    }
});

UserSchema.statics.doesNotExist = async function (field) {
    return (await this.where(field).countDocuments()) === 0;
};

UserSchema.methods.comparePasswords = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, "sha512").toString("hex");
    return this.hash === hash;
};

const User = mongoose.model("User", UserSchema);
export default User;
*/
