# Express HTTP Context
Get and set request-scoped context anywhere.  This is just an unopinionated, idiomatic ExpressJS imlementation of [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage).  It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data.

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

Now you can set values based on the incomming request:

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

And then get them even from code that doesn't have access to the epxress `req` object:

``` js
var httpContext = require('express-http-context');

// Somewhere deep in the Todo Service
function createTodoItem(title, content, callback) {
	var user = httpContext.get('user');
	db.insert({ title, content, userId: user.id }, callback);
}
```
