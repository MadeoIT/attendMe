const R = require('ramda');

exports.changeObjectKeyName = function (obj, oldKey, newKey) {
  const clonedObject = { ...obj, [newKey]: obj[oldKey] };
  delete clonedObject[oldKey];
  return clonedObject;
};

exports.changeObjectKeyValue = R.curry(
   /**
   * @param {Object} obj
   * @param {String} key
   * @param {any} value
   * @returns {Object}
   */
  (obj, key, value) => {
    const newObj = { ...obj };
    newObj[key] = value;
    return newObj;
  } 
);