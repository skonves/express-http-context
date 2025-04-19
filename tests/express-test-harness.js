'use strict'

const express = require('express');
const supertest = require('supertest');

const httpContext = require('../index');
const { init, REQUEST_ID_CONTEXT_KEY, REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME } = require('@oliverlockwood/express-http-context-intermediate-library');

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
			httpContext.set('key', 'middleware value');
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
			expect(res.body.otherValue).toBe('middleware value');
      done();
		});

		sut.get('/test').query({ delay: 50, value: value2 }).end((err, res) => {
			// ASSERT
			expect(res.body.value).toBe(value2);
			expect(res.body.otherValue).toBe('middleware value');
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

	it('maintains unique value when the library is depended upon both directly and transitively', async () => {
		// ARRANGE
		const app = express();

		// this function in the test library makes the following two calls:
		//   1.  app.use(middleware) and
		//   2.  httpContext.set(REQUEST_ID_CONTEXT_KEY, <a unique id>)
		// as can be seen in https://github.com/oliverlockwood/express-http-context-intermediate-library/blob/original-express-http-context/src/index.ts#L13-L19
		init(app);

		app.get('/', ((req, res) => {
			httpContext.set('value', req.query['value']);

			res.status(200).json({
				fred: '123',
				value: req.query['value'],
				valueFromContext: httpContext.get('value'),
				requestId: httpContext.get(REQUEST_ID_CONTEXT_KEY)
			});
		}));

		const request = supertest(app);

		// ACT
		const [response1, response2] = await Promise.all([
			request.get('/').query({ value: 'value1' }),
			request.get('/').query({ value: 'value2' }),
		]);

		// ASSERT
		expect(response1.body.value).toBe('value1');
		expect(response2.body.value).toBe('value2');

		expect(response1.header[REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME]?.length).toBe(21);
		expect(response2.header[REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME]?.length).toBe(21);

		// This is the specific example I had flagged in the Github issues (#26, #78) - where
		// setting something into the httpContext in a common library, but it's
		// unusable from within the application code.
		expect(response1.body.requestId).toBe(response1.header[REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME]);
		expect(response2.body.requestId).toBe(response2.header[REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME]);

		// These operations also fail, I suspect, because neither of the set/get
		// functions are usable, because the directly imported AsyncLocalStorage has
		// not been initialised by a call to `app.use(middleware)` within our code
		// here.  Effectively this is another manifestation of the same bug -
		// showing that although the middleware *has* already been initialised in
		// Express request handler chain, it is not usable because the
		// AsyncLocalStorage context is not identical for all usages of the
		// `express-http-context` library code.
		expect(response1.body.valueFromContext).toBe('value1');
		expect(response2.body.valueFromContext).toBe('value2');
	});
});
