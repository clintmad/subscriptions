var express = require('express');
var app = express();

app.use(express.static('public'));

var subscriptions = require('./routes/subscriptions')
app.use('/subscriptions', subscriptions);


module.exports = app;