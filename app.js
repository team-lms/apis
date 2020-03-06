const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const api = require('./src/api');

const app = express();

app.use(morgan(':method : url : status :user-agent - :response-time ms'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);
app.get('*', (_, res) => res.status(200).json({ message: 'App is running well' }));

app.listen(3000);
