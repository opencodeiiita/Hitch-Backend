const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require('./src/config/db.config');
const { response_200 } = require('./src/utils/responseCodes.utils');

dotenv.config();
const port = process.env.PORT || 5000;

mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit();
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => response_200(res, 'Server is running'));
require('./src/routes/auth.routes')(app);

app.listen(port, () =>
    console.log(`🚀 Server running on port http://localhost:${port}/`)
);
