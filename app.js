const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const dbConfig = require("./src/config/db.config");
const { response_200 } = require("./src/utils/responseCodes.utils");
const authRouter = require("./src/routes/auth.routes");
const workspaceRouter = require("./src/routes/workspace.routes");
const userRouter = require("./src/routes/user.routes");
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

// routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => response_200(res, "Server is running"));

// path to get all usrs
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  return response_200(res, "Users fetched successfully", users);
});

const workspaceRoutes = require("./src/routes/workspace.routes");
app.use("/api/workspace", workspaceRoutes);

const channelRoutes = require("./src/routes/channel.routes");
app.use("/api/channel", channelRoutes);

const subChannelRouter = require("./src/routes/subChannel.routes");
app.use("/api/subchannel", subChannelRouter);
app.listen(port, () =>
  console.log(`🚀 Server running at http://localhost:${port}/`)
);
