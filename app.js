const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('My AI Doctor app is working fine!');
});

module.exports = app;