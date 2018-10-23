'use strict'

const assert = require('chai').assert;

const httpContext = require('../browser');

describe('express-http-context/Browser API', function () {
  it('returns a `null` namespace', () => {
    assert.equal(httpContext.ns, null);
  });

  it('returns a `null` value when get() is called', () => {
    assert.equal(httpContext.get('key'), null);
  });

  it('does not do anything when set() is called', () => {
    httpContext.set('key', 'value');
  });

  it('throws when middleware() is called', () => {
    assert.throws(() => {
      httpContext.middleware();
    }, /from the browser code/);
  });
});
