const { 
  getLocationFromRequest, sendNotificationIfDistanceIsExceeded, getCoordinatesFromLocation, calculateDistance
} = require('../../Services/geoLocationService');
const { generateFakeTenantObj } = require('../sharedBehaviours');

describe('geo location service', () => {
  const point1 = [51.9, 4.5];
  const point2 = [52.5, -0.2];

  //Km calculated with a web calculator 
  //http://www.movable-type.co.uk/scripts/latlong.html
  const distance = 327; //km approximately

  it('should return an array of coordinates', () => {
    const arrayCoordinates = getCoordinatesFromLocation('51.9,4.5');

    expect(arrayCoordinates.length).toBe(2);
    expect(arrayCoordinates).toEqual(expect.arrayContaining([4.5, 51.9]));
  });

  it('should return a distance in Km', () => {
    const result = calculateDistance(...point1, ...point2);

    expect(Math.floor(result)).toBeCloseTo(distance);
  });

  describe('Get location from request body', () => {
    it('should get 2 strings or coordinates', () => {
      const req = {
        cookies: {
          'last-location': '51.9,4.5'
        },
        headers: {
          'current-location': '52.5,-0.2'
        },
        user: {
          ...generateFakeTenantObj()
        }
      };
      const result = getLocationFromRequest(req);

      expect(Object.keys(result).length).toBe(2);
      expect(result.lastLocation).toBe('51.9,4.5');
    });

    it('should get "0,0" because location has not been provided', () => {
      const req = {
        cookies: {
          'last-location': '51.9,4.5'
        },
        headers: {},
        user: {
          ...generateFakeTenantObj()
        }
      };
      const result = getLocationFromRequest(req);

      expect(Object.keys(result).length).toBe(2);
      expect(result.lastLocation).toBe('0,0');
      expect(result.currentLocation).toBe('0,0');
    });
  });

  describe('Send notification', () => {

    it('should send a notification / distance exceeded',  async () => {
      const response = await sendNotificationIfDistanceIsExceeded(distance, generateFakeTenantObj());

      expect(Object.keys(response)).toContain('accepted');
    });

    it('should not send a notification / distance does not exceed', async () => {
      const response = await sendNotificationIfDistanceIsExceeded(90, generateFakeTenantObj());

      expect(response).toBe(90);
    })
  })
})
