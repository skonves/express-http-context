module.exports = {
  middleware: function (req, res, next) {
    throw new Error('`middleware` cannot be called from the browser code.');
  },
  get: function () {
    return null;
  },
  set: function (key, value) {
    // noop
  },
  ns: null,
};
