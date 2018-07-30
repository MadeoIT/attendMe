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