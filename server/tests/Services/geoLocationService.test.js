const { 
  getLocationFromRequest, convertLocationToCoordinates, calculateDistance
} = require('../../Services/geoLocationService');
const { generateFakeTenantObj } = require('../sharedBehaviours');

describe('geo location service', () => {
  const point1 = [51.9, 4.5];
  const point2 = [52.5, -0.2];

  //Km calculated with a web calculator 
  //http://www.movable-type.co.uk/scripts/latlong.html
  const distance = 327; //km approximately

  it('should return an array of coordinates', () => {
    const arrayCoordinates = convertLocationToCoordinates('51.9,4.5');

    expect(arrayCoordinates.length).toBe(2);
    expect(arrayCoordinates).toEqual(expect.arrayContaining([4.5, 51.9]));
  });

  describe('Harvesine formula', () => {
    it('should return a distance of 0', () => {
      const result = calculateDistance(...[0, 0], ...[0, 0]);
  
      expect(Math.floor(result)).toBeCloseTo(0);
    });
  
    it('should return a distance in Km', () => {
      const result = calculateDistance(...point1, ...point2);
  
      expect(Math.floor(result)).toBeCloseTo(distance);
    });
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

      expect(result.length).toBe(2);
      expect(result[0]).toBe('51.9,4.5');
      expect(result[1]).toBe('52.5,-0.2');
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
      expect(result[0]).toBe('0,0');
      expect(result[1]).toBe('0,0');
    });
  });

  it('composite function to calculate distance', () => {
    const R = require('ramda');
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
    const result = calculateDistance(
      ...R.concat(
        ...R.map(
          convertLocationToCoordinates, 
          getLocationFromRequest(req)
        )
      )
    )
    
    expect(Math.floor(result)).toBeCloseTo(distance);
  })
})
