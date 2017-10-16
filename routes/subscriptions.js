var express = require('express');

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false });

var redis = require('redis');
if (process.env.REDISTOGO_URL) {
    var rtg = require("url").parse(process.env.REDISTOGO_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
    client.select((process.env.NODE_ENV || 'development').length);
}

var router = express.Router();

router.route('/')
    .get(function (request, response) {
        client.hkeys('subscriptions', function (error, names) {
            if (error) throw error;

            response.json(names);
        });
    })

    .post(urlencode, function (request, response) {
        var newSubscription = request.body;
        if (!newSubscription.name || !newSubscription.description) {
            response.sendStatus(400);
            return false;
        }
        client.hset('subscriptions', newSubscription.name, newSubscription.description, function (error) {
            if (error) throw error;

            response.status(201).json(newSubscription.name);
        });
    });


router.route('/:name')
    .delete(function (request, response) {
        client.hdel('subscriptions', request.params.name, function (error) {
            if (error) throw error;
            response.sendStatus(204);
        });
    })

    .get(function (request, response) {
        client.hget('subscriptions', request.params.name, function (error, description) {
            response.render('show.ejs',
                {
                    subscription:
                    { name: request.params.name, description: description }
                });
        });
    });

module.exports = router;
