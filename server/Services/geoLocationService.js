const R = require('ramda');
const { createCookie } = require('../middleware/token');
const { sendNotification } = require('../middleware/notification');
const { createEmailMessage, htmlGeolocationMismatch } = require('../middleware/messages');
const COOCKIE_MAX_AGE = 14 * 24 * 60 * 60 * 1000; 
const SAMPLE_DISTANCE = 100; //km

const degToRad = (degree) => degree * (Math.PI / 180);

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
const convertLocationToCoordinates = (location) => 
  location.split(',').map(coordinate => Number(coordinate));

/**
 * Extract the location from the cookie and the header
 * @param {Object} req object from the request 
 * @returns {Array} array of locations
 * If the location was not provided it will return 
 * an arbitrary string value of '0,0'. This means the notification
 * will not be sent.
 */
const getLocationFromRequest = (req) => {
  if(
    !req.cookies || !req.cookies['last-location'] ||
    !req.headers || !req.headers['current-location']
  ) return ['0,0', '0,0'];
  
  return [
    req.cookies['last-location'],
    req.headers['current-location']
  ]
};

/**
 * Calculate distance between location and send a notification if the distance
 * exceed the minimum distance
 * @param {Object} req request body
 */
const geolocationService = async (req, res, next) => {
  try {
    const { user } = req;
   
    const distance = calculateDistance(
      ...R.concat(
        ...R.map(
          convertLocationToCoordinates, 
          getLocationFromRequest(req)
        )
      )
    );
    
    if(distance <= SAMPLE_DISTANCE) return next();
    
    const message = createEmailMessage(
      'account-activity@todo.com', 
      user.email, 
      'Recent log in',  
      htmlGeolocationMismatch(user)
    );

    await sendNotification('email')(message);
    const currentLocation = getLocationFromRequest(req)[1];
    createCookie(res, 'last-location', currentLocation, COOCKIE_MAX_AGE);
    next();

  } catch (error) {
    next(error);
  }
};


module.exports = {
  geolocationService,
  getLocationFromRequest,
  convertLocationToCoordinates,
  calculateDistance
}