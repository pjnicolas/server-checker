module.exports = {
  string: x => typeof x === 'string',
  notEmptyString: x => typeof x === 'string' && x !== '',
  number: x => Number.isFinite(x),
  integer: x => Number.isInteger(x),
  object: x => typeof x === 'object' && x !== null,
  array: x => Array.isArray(x),
  null: x => x === undefined || x === null,
  boolean: x => x === true || x === false,
  to: {
    stringToBoolean: x => {
      if (x === 'true') {
        return true;
      }

      if (x === 'false') {
        return false;
      }

      return x;
    }
  },
};
