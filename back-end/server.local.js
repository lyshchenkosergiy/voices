require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/express');

const { 
  BACK_END_PORT,
  BACK_END_CONNECTION_STRING
} = process.env;

(async () => {
  await mongoose.connect(BACK_END_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
  app.listen(BACK_END_PORT, () => console.log(`Back-end started on port: ${BACK_END_PORT}!`));
})();
