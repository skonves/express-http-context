'use strict'

const express = require('express');
const supertest = require('supertest');

const httpContext = require('../index');

describe('express-http-context', function () {
	it('does not store or return context outside of request', function () {
		// ARRANGE
		const key = 'key';

		// ACT
		const storedValue = httpContext.set(key, 'value');
		const result = httpContext.get(key);

		// ASSERT
		expect(storedValue).toBeUndefined();
		expect(result).toBeFalsy();
	});

	it('maintains unique value across concurrent requests with callbacks', function (done) {
		// ARRANGE
		const app = express();

		app.use(httpContext.middleware);

		app.get('/test', (req, res) => {
			const delay = new Number(req.query.delay);
			const valueFromRequest = req.query.value;

			const setReturnValue = httpContext.set('value', valueFromRequest);

			setTimeout(() => {
				const valueFromContext = httpContext.get('value');
				res.status(200).json({
					value: valueFromContext,
					setReturnValue,
				});
			}, delay);
		});

		const sut = supertest(app);

		const value1 = 'value1';
		const value2 = 'value2';

		// ACT
		sut.get('/test').query({ delay: 100, value: value1 }).end((err, res) => {
			// ASSERT
			expect(res.body.value).toBe(value1);
			expect(res.body.setReturnValue).toBe(value1);
			done();
		});

		sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
			// ASSERT
			expect(res.body.value).toBe(value2);
			expect(res.body.setReturnValue).toBe(value2);
		});
	});

	it('maintains unique value across concurrent requests with native promises', function (done) {
    // ARRANGE
    const app = express();

    app.use(httpContext.middleware);

    app.get('/test', (req, res) => {
			const delay = new Number(req.query.delay);
      const valueFromRequest = req.query.value;

      const setReturnValue = httpContext.set('value', valueFromRequest);

      const doJob = () => {
        new Promise(resolve => setTimeout(resolve, delay)).then(() => {
					const valueFromContext = httpContext.get('value');
					res.status(200).json({
						value: valueFromContext,
						setReturnValue,
					});
				});
      };

      doJob();
    });

    const sut = supertest(app);

    const value1 = 'value1';
    const value2 = 'value2';

    // ACT
    sut.get('/test').query({ delay: 100, value: value1 }).end((err, res) => {
      // ASSERT
			expect(res.body.value).toBe(value1);
			expect(res.body.setReturnValue).toBe(value1);
      done();
    });

    sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
      // ASSERT
			expect(res.body.value).toBe(value2);
			expect(res.body.setReturnValue).toBe(value2);
    });
  });

  it('maintains unique value across concurrent requests with async/await', function (done) {
    // ARRANGE
    const app = express();

    app.use(httpContext.middleware);

    app.get('/test', (req, res) => {
			const delay = new Number(req.query.delay);
      const valueFromRequest = req.query.value;

      httpContext.set('value', valueFromRequest);

      const doJob = async () => {
        await new Promise(resolve => setTimeout(resolve, delay));
        const valueFromContext = httpContext.get('value');
        res.status(200).json({
          value: valueFromContext
        });
      };

      doJob();
    });

    const sut = supertest(app);

    const value1 = 'value1';
    const value2 = 'value2';

    // ACT
    sut.get('/test').query({ delay: 100, value: value1 }).end((err, res) => {
      // ASSERT
			expect(res.body.value).toBe(value1);
      done();
		});

		sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
			// ASSERT
			expect(res.body.value).toBe(value2);
		});
  });

	it('maintains context even if middleware is used multiple times', function (done) {
    // ARRANGE
    const app = express();

    app.use(httpContext.middleware);
		app.use((req, res, next) => {
			httpContext.set('key', 'middlware value');
			next();
		});
    app.use(httpContext.middleware);

    app.get('/test', (req, res) => {
			const delay = new Number(req.query.delay);
      const valueFromRequest = req.query.value;

      httpContext.set('value', valueFromRequest);

      const doJob = async () => {
        await new Promise(resolve => setTimeout(resolve, delay));
        const valueFromContext = httpContext.get('value');
				const valueFromKey = httpContext.get('key');
        res.status(200).json({
          value: valueFromContext,
					otherValue: valueFromKey
        });
      };

      doJob();
    });

    const sut = supertest(app);

    const value1 = 'value1';
    const value2 = 'value2';

    // ACT
    sut.get('/test').query({ delay: 100, value: value1 }).end((err, res) => {
      // ASSERT
			expect(res.body.value).toBe(value1);
			expect(res.body.otherValue).toBe('middlware value');
      done();
		});

		sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
			// ASSERT
			expect(res.body.value).toBe(value2);
			expect(res.body.otherValue).toBe('middlware value');
		});
  });

  it('returns undefined when key is not found', function (done) {
		// ARRANGE
		const app = express();

		app.use(httpContext.middleware);

		app.get('/test', (req, res) => {
			httpContext.set('existing-key', 'some value');

			setTimeout(() => {
				const valueFromContext = httpContext.get('missing-key');
				res.status(200).json({
					typeOfValueFromContext: typeof (valueFromContext)
				});
			}, 5);
		});

		const sut = supertest(app);

		// ACT
		sut.get('/test').end((err, res) => {
			// ASSERT
			expect(res.body.typeOfValueFromContext).toBe('undefined');
			done();
		});
	});
});
