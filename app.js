const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const dbConfig = require("./src/config/db.config");
const { response_200 } = require("./src/utils/responseCodes.utils");
const authRouter = require("./src/routes/auth.routes");
const User = require("./src/models/user.models");
dotenv.config();
const port = process.env.PORT || 5000;

const cookieParser = require("cookie-parser");

mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
    .then(() => {
        console.log("🎉 Successfully connected to MongoDB.");
    })
    .catch((err) => {
        console.error("💩 Failed to connect to MongoDB\n", err);
        process.exit();
    });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/api/user", authRouter);

app.get("/", (req, res) => response_200(res, "Server is running"));

// path to get all usrs
app.get("/api/users", async (req, res) => {
    const users = await User.find();
    return response_200(res, "Users fetched successfully", users);
});
const workspaceRoutes = require("./src/routes/workspace.routes");

app.use("/api/workspace", workspaceRoutes);
app.listen(port, () =>
    console.log(`🚀 Server running on port http://localhost:${port}/`)
);
