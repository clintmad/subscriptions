var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var redis = require('redis');
var client = redis.createClient();

client.select((process.env.NODE_ENV || 'development').length);

app.get('/subscriptions', function (req, res) {
    client.hkeys('subscriptions', function (err, names) {
        if(err) throw err
        res.json(names);
    });
});

app.post('/subscriptions', urlencode, function (req, res) {
    var newSubscription = req.body;
    client.hset('subscriptions', newSubscription.name, newSubscription.description, function(err) {
        if(err) throw err
        res.status(201).json(newSubscription.name);
    });
    
});


module.exports = app;