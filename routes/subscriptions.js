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
  .get(function (req, res) {
    client.hkeys('subscriptions', function (err, names) {
      if (err) throw err;

      res.json(names);
    });
  })

  .post(urlencode, function (req, res) {
    var newSubscription = req.body;
    if (!newSubscription.name || !newSubscription.description) {
      res.sendStatus(400);
      return false;
    }
    client.hset('subscriptions', newSubscription.name, newSubscription.description, function (err) {
      if (err) throw err;

      res.status(201).json(newSubscription.name);
    });
  });


router.route('/:name')
  .delete(function (req, res) {
    client.hdel('subscriptions', req.params.name, function (err) {
      if (err) throw err;
      res.sendStatus(204);
    });
  })
  .get(function (req, res) {
    client.hget('subscriptions',req.params.name, function (err, description) {
      res.render('show.ejs',
        {
          subscription:
          { name: req.params.name, description: description  }
        });
    });
  });

module.exports = router;
