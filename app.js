const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { response_200 } = require('./src/utils/responseCodes.utils');

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => response_200(res, 'Server is running'));

app.listen(port, () =>
    console.log(`🚀 Server running on port http://localhost:${port}/`)
);
