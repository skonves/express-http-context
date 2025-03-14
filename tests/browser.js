'use strict'

const httpContext = require('../browser');

describe('express-http-context/Browser API', function () {
  it('returns a `null` value when get() is called', () => {
    expect(httpContext.get('key')).toBeNull();
  });

  it('does not do anything when set() is called', () => {
    httpContext.set('key', 'value');
  });

  it('throws when middleware() is called', () => {
    expect(() => {
      httpContext.middleware();
    }).toThrow(/from the browser code/);
  });
});
