'use strict'

const assert = require('chai').assert;
const express = require('express');
const supertest = require('supertest');
const httpContext = require('../index');

it('maintains context when using async/await', function (done) {
	// ARRANGE
	const app = express();

	app.use(httpContext.middleware);

	const delayWithPromise = async delay => new Promise((resolve, reject) => setTimeout(resolve, delay));

	app.get('/test', async (req, res) => {
		const delay = new Number(req.query.delay);
		const valueFromRequest = req.query.value;

		httpContext.set('value', valueFromRequest);

		await delayWithPromise(delay)

		const valueFromContext = httpContext.get('value');
		res.status(200).json({
			value: valueFromContext
		});
	});

	const sut = supertest(app);

	const value1 = 'value1';
	const value2 = 'value2';

	// ACT
	sut.get('/test').query({ delay: 100, value: value1 }).end((err, res) => {
		// ASSERT
		assert.equal(res.body.value, value1);
		done();
	});

	sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
		// ASSERT
		assert.equal(res.body.value, value2);
	});
});