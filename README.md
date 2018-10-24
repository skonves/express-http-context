[![travis](https://img.shields.io/travis/skonves/express-http-context.svg)](https://travis-ci.org/skonves/express-http-context)
[![coveralls](https://img.shields.io/coveralls/skonves/express-http-context.svg)](https://coveralls.io/github/skonves/express-http-context)
[![npm](https://img.shields.io/npm/v/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)
[![npm](https://img.shields.io/npm/dm/express-http-context.svg)](https://www.npmjs.com/package/express-http-context)
[![david](https://img.shields.io/david/skonves/express-http-context.svg)](https://david-dm.org/skonves/express-http-context)

# Express HTTP Context
Get and set request-scoped context anywhere.  This is just an unopinionated, idiomatic ExpressJS implementation of [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked) (forked from [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage)).  It's a great place to store user state, claims from a JWT, request/correlation IDs, and any other request-scoped data. Context is preserved even over async/await (in node 8+).

## How to use it

Install: `npm install --save express-http-context`  
(Note: For node v4-7, use the legacy version: `npm install --save express-http-context@<1.0.0`)

Use the middleware immediately before the first middleware that needs to have access to the context.
You won't have access to the context in any middleware "used" before this one.

Note that some popular middlewares (such as body-parser, express-jwt) may cause context to get lost.
To workaround such issues, you are advised to use any third party middleware that does NOT need the context
BEFORE you use this middleware.

``` js
var express = require('express');
var httpContext = require('express-http-context');

var app = express();
// Use any third party middleware that does not need access to the context here, e.g. 
// app.use(some3rdParty.middleware);
app.use(httpContext.middleware);
// all code from here on has access to the same context for each request
```

Set values based on the incoming request:

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

You can access cls namespace directly as (it may be useful if you want to apply some patch to it, for example https://github.com/TimBeyer/cls-bluebird):
``` js
var ns = require('express-http-context').ns;
```

## Troubleshooting
To avoid weird behavior with express:
1. Make sure you require `express-http-context` in the first row of your app. Some popular packages use async which breaks CLS.

For users of Node 10
1. Node 10.0.x - 10.3.x are not supported.  V8 version 6.6 introduced a bug that breaks async_hooks during async/await.  Node 10.4.x uses V8 v6.7 in which the bug is fixed.  See: https://github.com/nodejs/node/issues/20274.

See [Issue #4](https://github.com/skonves/express-http-context/issues/4) for more context.  If you find any other weird behaviors, please feel free to open an issue.

## Contributors
* Steve Konves (@skonves)
* Amiram Korach (@amiram)
* Yoni Rabinovitch (@yonirab)
* DontRelaX (@dontrelax)
* William Durand (@willdurand)

Interesting in contributing? Take a look at the [Contributing Guidlines](/CONTRIBUTING.md)
