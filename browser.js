module.exports = {
  middleware: (req, res, next) => {
    throw new Error('`middleware` cannot be called from the browser code.');
  },
  get: (key) => {
    return null;
  },
  set: (key, value) => {
    // noop
  },
  ns: null,
};
