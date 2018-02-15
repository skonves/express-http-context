[![travis](https://img.shields.io/travis/amiram/express-cls-hooked.svg)](https://travis-ci.org/amiram/express-cls-hooked)
[![coveralls](https://img.shields.io/coveralls/amiram/express-cls-hooked.svg)](https://coveralls.io/github/amiram/express-cls-hooked)
[![npm](https://img.shields.io/npm/v/express-cls-hooked.svg)](https://www.npmjs.com/package/express-cls-hooked)
[![npm](https://img.shields.io/npm/dm/express-cls-hooked.svg)](https://www.npmjs.com/package/express-cls-hooked)
[![david](https://img.shields.io/david/amiram/express-cls-hooked.svg)](https://david-dm.org/amiram/express-cls-hooked)

# Express HTTP Context with async_hooks

**This package is forked from [express-http-context](https://github.com/skonves/express-http-context). It is using [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) which is a fork of [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) that uses async_hooks API, so context is preserved even over async/await in node 8+. If you're using node version < 8, just use the original [express-http-context](https://github.com/skonves/express-http-context).**  

Get and set request-scoped context anywhere.  This is just an unopinionated, idiomatic ExpressJS implementation of [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage).  It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data.

## How to use it

Install: `npm install --save express-cls-hooked`

Use the middleware.  The earlier the better; you won't have access to the context from any middleware "used" before this one.

``` js
var express = require('express');
var httpContext = require('express-cls-hooked');

var app = express();

app.use(httpContext.middleware);
// all code from here on has access to the same context for each request
```

Set values based on the incomming request:

``` js
// Example authorization middleware
app.use((req, res, next) => {
	userService.getUser(req.get('Authorization'), (err, result) => {
		if (err) {
			next(err);
		} else {
			httpContext.set('user', result.user)
			next();
		}
	});
});
```

Get them from code that doesn't have access to the express `req` object:

``` js
var httpContext = require('express-cls-hooked');

// Somewhere deep in the Todo Service
function createTodoItem(title, content, callback) {
	var user = httpContext.get('user');
	db.insert({ title, content, userId: user.id }, callback);
}
```

## Troubleshooting
To avoid weird behavior with express:
1. Make sure you require `express-cls-hooked` in the first row of your app. Some popular packages use async which breaks CLS.
1. If you are using `body-parser` and context is getting lost, register it in express before you register `express-cls-hooked`'s middleware.

See [Issue #4](https://github.com/skonves/express-http-context/issues/4) for more context.  If you find any other weird behaviors, please feel free to open an issue.
