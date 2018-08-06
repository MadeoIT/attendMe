/**
 * Return a middle ware function
 * @param {Function} middlewareFunction middleware function
 * The middleware code must be injected in the controller
 * This function provide a way to inject a piece of code into a middleware
 * to facilitate unit testing
 */
exports.asyncMiddlewareComposer = (middlewareFunction) => async (req, res, next) => {
  try {
    await middlewareFunction(req, res);
    next();
    
  } catch (error) {
    next(error);
  }
};

exports.syncMiddlewareComposer = (middlewareFunction) => (req, res, next) => {
  middlewareFunction(req);
  next();
}

exports.changeObjectKeyName = function (obj, oldKey, newKey) {
  const clonedObject = { ...obj, [newKey]: obj[oldKey] };
  delete clonedObject[oldKey];
  return clonedObject;
};

exports.changeObjectKeyValue = (obj, key, value) => {
  const newObj = { ...obj };
  newObj[key] = value;
  return newObj;
};