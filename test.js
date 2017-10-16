var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();

describe('Requests to the root path', function () {

    it('Returns a 200 status code', function (done) {

        request(app)
            .get('/')
            .expect(200, done);
    });
    it('Returns a HTML format', function(done) {
        
        request(app)
            .get('/')
            .expect('Content-Type', /html/, done);
    });
    it('Returns an index file with Subscriptions', function(done) {

        request(app)
            .get('/')
            .expect(/subscriptions/i, done);
    });
});

describe('Listing subscriptions on /subscriptions', function () {

    it('Returns 200 status code', function (done) {

        request(app)
            .get('/subscriptions')
            .expect(200, done);

    });
    it('Returns JSON format', function (done) {

        request(app)
            .get('/subscriptions')
            .expect('Content-Type', /json/, done);
    });

    it('Returns initial subscriptions', function (done) {

        request(app)
            .get('/subscriptions')
            .expect(JSON.stringify([]), done);
    });
});

describe('Creating new subscriptions', function() {

    it('Returns a 201 status code', function(done) {

        request(app)
            .post('/subscriptions')
            .send('name=Netflix&description=streaming&date=02/02/2018')
            .expect(201, done);
    });
    it('Return the subscription name', function(done) {

        request(app)
            .post('/subscriptions')
            .send('name=Netflix&description=streaming&date=02/02/2018')
            .expect(/netflix/i, done);
    });
    it('Validates name and date', function(done) {

        request(app)
            .post('/subscriptions')
            .send('name=&date=')
            .expect(400, done);
    });
});

describe('Deleting subscriptions', function() {

    before(function() {
        client.hset('subscriptions', 'Hulu', 'streaming');
    });

    after(function(){
        client.flushdb();
    });

    it('Returns a 204 status code', function(done) {

        request(app)
            .delete('/subscriptions/Hulu')
            .expect(204, done);
    });
});

describe('Shows subscription info', function() {

    before(function() {
        client.hset('subscriptions', 'Hulu', 'streaming')
    });

    after(function() {
        client.flushdb();
    });

    it('Returns 200 status', function(done) {
        request(app)
            .get('/subscriptions/Hulu')
            .expect(200, done);
    });
    it('Returns HTML format', function(done) {
        request(app)
            .get('/subscriptions/Hulu')
            .expect('Content-Type', /html/, done);
    });
    it('Returns information for given subscription', function(done) {
        request(app)
            .get('/subscriptions/Hulu')
            .expect(/streaming/, done);
    });
});
