var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/subscriptions', function(req, res) {
    var subscriptions = [];
    res.json(subscriptions);
});


module.exports = app;