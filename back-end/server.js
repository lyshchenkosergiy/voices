const mongoose = require('mongoose');
const app = require('./src/express');
const serverless = require('serverless-http');

const {
  BACK_END_CONNECTION_STRING
} = process.env;

let serverlessInstance;
const handler = async (event, context) => {
  if (!serverlessInstance) {
    await mongoose.connect(BACK_END_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    serverlessInstance = serverless(app, { request: (request) => request.serverless = ({ event, context }) });
  }
  context.callbackWaitsForEmptyEventLoop = false;
  const res = await serverlessInstance(event, context);
  return res;
};
module.exports = { handler };
