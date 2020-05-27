const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const Chalk = require('chalk');
const api = require('./src/api');
require('dotenv').config();

const app = express();

// Redirect to https if not on https
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(morgan(':method : url : status :user-agent - :response-time ms'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);
app.get('*', (_, res) => res.status(200).json({ message: 'App is running well' }));

app.listen(process.env.PORT, () => {
  Chalk.blue(`App is running on port ${process.env.PORT}`);
});
