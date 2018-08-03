/**
 * Return a middle ware function
 * @param {Function} middleware middleware function
 * The middleware code must be injected in the controller
 * This function provide a way to inject a piece of code into a middleware
 */
exports.middlewareComposer = (middleware) => async (req, res, next) => {
  try {
    await middleware(req, res);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Return a middleware function that end the response cycle
 * @returns {Function} 
 * This function is used in the controller and it close the response
 * returning a response object
 */
exports.endMiddleware = () => {
  return (req, res) => {
    res.status(200).send(req.responseObj);
  }
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