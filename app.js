var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

var redis = require('redis');
if(process.env.REDISTOGO_URL) {
    var rtg = require('url').parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
}else {
    var client = redis.createClient();
    client.select((process.env.NODE_ENV || 'development').length);
}



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