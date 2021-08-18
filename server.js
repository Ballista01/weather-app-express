const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
  console.log(`Process.env.PORT = ${process.env.PORT}`);
});
