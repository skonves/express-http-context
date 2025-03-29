[![build](https://img.shields.io/github/actions/workflow/status/skonves/express-http-context/build.yml?branch=master)](https://github.com/skonves/express-http-context/actions/workflows/build.yml)
[![coveralls](https://img.shields.io/coveralls/skonves/express-http-context.svg)](https://coveralls.io/github/skonves/express-http-context)
[![npm](https://img.shields.io/npm/v/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)
[![npm](https://img.shields.io/npm/dm/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)

# Express HTTP Context
Get and set request-scoped context anywhere. This package is an unopinionated, zero-dependency, Express-idiomatic implementation of [Node AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage). It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data.

## How to use it

Install: `npm i express-http-context`  

Use the context middleware before the first middleware or handler that needs to have access to the context.

``` js
import express from 'express';
import * as httpContext from 'express-http-context';

const app = express();
app.use(httpContext.middleware);
// All code from here on has access to the same context for each request
```

Set values based on the incoming request:

``` js
// Example authentication middleware
app.use(async (req, res, next) => {
	try {
		// Get user from data on request
		const bearer = req.get('Authorization');
		const user = await userService.getUser(bearer);

		// Add user to the request-scoped context
		httpContext.set('user', user);

		return next();
	} catch (err) {
		return next(err);
	}
});
```

Get them from code that doesn't have access to the express `req` object:

``` js
import * as httpContext from 'express-http-context';

// Somewhere deep in the Todo Service
async function createTodoItem(title, content) {
	// Get the user from the request-scoped context
	const user = httpContext.get('user');

	await db.insert({ title, content, userId: user.id });
}
```

## Legacy versions

* For Node <7: `npm install --save express-http-context@0`
* For Node >=8 <12: `npm install --save express-http-context@1`

## Contributors
* Steve Konves (@skonves)
* Amiram Korach (@amiram)
* Yoni Rabinovitch (@yonirab)
* DontRelaX (@dontrelax)
* William Durand (@willdurand)
* Kristopher Morris (@beeduck)

Interesting in contributing? Take a look at the [Contributing Guidlines](/CONTRIBUTING.md)
