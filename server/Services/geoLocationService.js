const { createCookie } = require('../middleware/token');
const { sendNotification } = require('../Services/notificationService');
const messages = require('../middleware/messages');
const COOCKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; 
const SAMPLE_DISTANCE = 100; //km

const degToRad = (degree) => {
  return degree * (Math.PI / 180)
};

/**
 * Harvesine formula
 * @param {Number} lat1 
 * @param {Number} lon1 
 * @param {Number} lat2 
 * @param {Number} lon2 
 * @returns {Number} distance in km
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = degToRad(lat2 - lat1);  // degToRad below
  var dLon = degToRad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

/**
 * Get a geolocation string and output an array of Coordinates
 * @param {String} coordinates 
 * @returns {Array<Number>}
 */
const getCoordinatesFromLocation = (location) => {
  return location
    .split(',')
    .map(coordinate => Number(coordinate));
};

/**
 * Extract the location from the cookie and the header
 * @param {Object} req object from the request 
 * If the location was not provided it will return 
 * an arbitrary string value of '0,0'. This means the notification
 * will not be sent.
 */
const getLocationFromRequest = (req) => {
  if(
    !req.cookies || 
    !req.cookies['last-location'] ||
    !req.headers ||
    !req.headers['current-location']
  ) return {
    lastLocation: '0,0',
    currentLocation: '0,0'
  };
  
  return {
    lastLocation: req.cookies['last-location'],
    currentLocation: req.headers['current-location']
  };
};

const sendNotificationIfDistanceIsExceeded = async (distance, user) => {
  if(distance <= SAMPLE_DISTANCE) return distance; 

  const message = messages.geolocationMismatch(user);
  return await sendNotification('email')(message);
};

/**
 * Calculate distance between location and send a notification if the distance
 * exceed the minimum distance
 * @param {Object} req request body
 * The geolocation of the request is going to be on the header.
 * The geolocation of the previous request is going to be in the cookie.
 */
const geolocationService = async (req, res, next) => {
  try {
    const { user } = req;
    const { lastLocation, currentLocation } = getLocationFromRequest(req);
    const coordinatesLastLocation = getCoordinatesFromLocation(lastLocation);
    const coordinatesCurrentLocation = getCoordinatesFromLocation(currentLocation);
    const distance = calculateDistance(...coordinatesLastLocation, ...coordinatesCurrentLocation);
    
    await sendNotificationIfDistanceIsExceeded(distance, user);
  
    createCookie(res, 'last-location', currentLocation, COOCKIE_MAX_AGE);
    next();

  } catch (error) {
    next(error);
  }
};

module.exports = {
  geolocationService,
  getLocationFromRequest,
  getCoordinatesFromLocation,
  sendNotificationIfDistanceIsExceeded,
  calculateDistance
}