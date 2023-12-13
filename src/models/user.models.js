const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const USER_ROLE = require("../enums/userRoles.enums");

const UserSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z ]+$/.test(v);
            },
            message: (name) => `${name.value} is not a valid name!`,
        },
    },
    email: {
        type: String,
        default: false,
        required: [true, "Email is required"],
        unique: [true, "Email already exist"],
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: (email) => `${email.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password must be atleast 6 character"],
    },

    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exist"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9]+$/.test(v); // Alphanumeric characters only
            },
            message: (username) => `${username.value} is not a valid username!`,
        },
    },

    // store the channels of the user with there role in the channel

    channels: [
        {
            chennel: {
                type: mongoose.Schema.ObjectId,
                ref: "channels",
            },
            role: {
                type: String,
                enum: USER_ROLE,
                default: USER_ROLE.NORMAL_USER,
            },
        },
    ],
});

// Reset password token generation
UserSchema.methods.generatePasswordReset = function () {
    const token = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    this.resetPasswordExpires =
        Date.now() + process.env.PASSWORD_RESET_LINK_EXPIRY * 60 * 1000;
    return token;
};

// Password Hashing
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password Compare
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Token
UserSchema.methods.generateToken = async function () {
    return await jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
    });
};

module.exports = mongoose.model("users", UserSchema);
