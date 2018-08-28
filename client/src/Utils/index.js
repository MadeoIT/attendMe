import * as R from 'ramda';

/**
 * Filter the undefined headers value and merge it in one object
 * @param {Object} args Objects
 * @returns {Object} Object containing the headers
 */
export function getHeaders(...args) {
  const doesExist = val => !R.isNil(val)
  return R.filter(doesExist, R.mergeAll(args))
}

export const getGeolocation = () => new Promise((resolve, reject) => {
  if (global.navigator && global.navigator.geolocation) {
    return global.navigator.geolocation.getCurrentPosition((position, err) => {
      if (err) reject(err);

      const { coords: { latitude, longitude } } = position;
      resolve(`${latitude},${longitude}`);
    })
  }
  return resolve();
});

export function resetState(state, self) {
  Object.keys(state).forEach(key => self.setState({ [key]: '' }))
};