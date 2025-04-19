'use strict';

const { AsyncLocalStorage } = require('async_hooks');

const STORAGE_KEY = Symbol.for(
	'skonves/express-http-context/asyncLocalStorage',
);

globalThis[STORAGE_KEY] = globalThis[STORAGE_KEY] ?? new AsyncLocalStorage();

/** Express.js middleware that is responsible for initializing the context for each request. */
function middleware(req, res, next) {
  const asyncLocalStorage = globalThis[STORAGE_KEY];
  if (!asyncLocalStorage.getStore()) {
    asyncLocalStorage.run(new Map(), () => next());
  } else {
    next();
  }
}

/**
 * Gets a value from the context by key.  Will return undefined if the context has not yet been initialized for this request or if a value is not found for the specified key.
 * @param {string} key
 */
function get(key) {
	return globalThis[STORAGE_KEY].getStore()?.get(key);
}

/**
 * Adds a value to the context by key.  If the key already exists, its value will be overwritten.  No value will persist if the context has not yet been initialized.
 * @param {string} key
 * @param {*} value
 */
function set(key, value) {
  const asyncLocalStorage = globalThis[STORAGE_KEY];
	if (asyncLocalStorage.getStore()) {
		asyncLocalStorage.getStore()?.set(key, value);
		return value;
	}
	return undefined;
}

module.exports = {
	middleware,
	get: get,
	set: set,
	asyncLocalStorage: globalThis[STORAGE_KEY],
};
