'use strict';

const store = require('continuation-local-storage').createNamespace('a6a29a6f-6747-4b5f-b99f-07ee96e32f88');

module.exports = {
	middleware: function (req, res, next) {
		store.run(() => next());
	},
	get: function (key) {
		return store.get(key);
	},
	set: function (key, value) {
		return store.set(key, value);
	}
}
