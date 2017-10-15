var request = require('supertest');
var app = require('./app');

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
            .expect('Content-Type', /json/, done)
    });

    it('Returns initial subscriptions', function (done) {
        request(app)
            .get('/subscriptions')
            .expect(JSON.stringify([]), done);
    });
});
