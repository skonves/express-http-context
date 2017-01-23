'use strict';

const cls = require('continuation-local-storage');

const nsid = 'a6a29a6f-6747-4b5f-b99f-07ee96e32f88';

module.exports = {
	middleware: function (req, res, next) {
		if (cls.getNamespace(nsid)) {
			const ns = cls.createNamespace(nsid);
			ns.run(() => next());
		}
	},
	get: function (key) {
		const ns = cls.getNamespace(nsid);
		return ns.get(key);
	},
	set: function (key, value) {
		const ns = cls.getNamespace(nsid);
		return ns.set(key, value);
	}
}
