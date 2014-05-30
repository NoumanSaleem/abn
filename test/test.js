var cookies = require('cookies'),
	express = require('express'),
	request = require('supertest'),
	should = require('should'),
	ab = require('../');

describe('test', function () {
	var app = express(),
		agent = request.agent(app),
		agent2 = request.agent(app),
		homeAB = ab.test('home');

	app.use(cookies.express());

	app.get('/', homeAB(), function (req, res) {
		res.end("variant 1");
	});

	app.get('/', homeAB(), function (req, res) {
		res.end("variant 2");
	});

	it('should return variant 1', function(done) {
		agent
			.get('/')
			.expect('variant 1')
			.end(done);
	});

	it('should return variant 2', function(done) {
		agent2
			.get('/')
			.expect('variant 2')
			.end(done);
	});

	it('should again return variant 2', function(done) {
		agent2
			.get('/')
			.expect('variant 2')
			.end(done);
	});
});
