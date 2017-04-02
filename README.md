[![travis](https://img.shields.io/travis/skonves/express-http-context.svg)](https://travis-ci.org/skonves/express-http-context)
[![npm](https://img.shields.io/npm/v/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)
[![npm](https://img.shields.io/npm/dm/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)

# Express HTTP Context
Get and set request-scoped context anywhere.  This is just an unopinionated, idiomatic ExpressJS implementation of [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage).  It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data.

## How to use it

Install: `npm install --save express-http-context`

Use the middleware.  The earlier the better; you won't have access to the context from any middleware "used" before this one.

``` js
var express = require('express');
var httpContext = require('express-http-context');

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
var httpContext = require('express-http-context');

// Somewhere deep in the Todo Service
function createTodoItem(title, content, callback) {
	var user = httpContext.get('user');
	db.insert({ title, content, userId: user.id }, callback);
}
```
