"use strict";

const httpContext = require("./express-http-context");
const { nanoid } = require("nanoid");

const REQUEST_ID_HTTP_HEADER_NAME = "my-request-id";
const REQUEST_ID_CONTEXT_KEY = "myRequestId";

// less realistic, but useful for testing!
const REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME = "my-request-id-in-response";

function init(app) {
  app.use(httpContext.middleware);

  app.use((req, res, next) => {
    const requestId = req.header(REQUEST_ID_HTTP_HEADER_NAME) || nanoid();

    httpContext.set(REQUEST_ID_CONTEXT_KEY, requestId);
    res.header(REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME, requestId);

    next();
  });
}

module.exports = {
  init,
  REQUEST_ID_CONTEXT_KEY,
  REQUEST_ID_IN_RESPONSE_HTTP_HEADER_NAME,
};
