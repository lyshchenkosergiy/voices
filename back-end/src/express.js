const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const { middleware } = require('./utils/cognito');
const { errorHandler } = require('./utils/express');

const profileRoutes = require('./routes/profile');
const votingRoutes = require('./routes/voting');
const systemRoutes = require('./routes/system');

app.use(cors());
app.use(bodyParser.json());

app.use(middleware);
app.use('/profile', profileRoutes);
app.use('/voting', votingRoutes);
app.use('/system', systemRoutes);
app.use(errorHandler);

module.exports = app;
