import { getHeaders, getGeolocation, getCsrfToken } from '../../Utils';

describe('Utils function', () => {

  afterEach(() => {
    localStorage.clear();
  })

  it('should get auth headers with csrf token', () => {
    localStorage.setItem('csrf-token', '123');
    const token = getCsrfToken();

    expect(token).toBe('123');
  });

  describe('Geolocation', () => {
    it('should get the current device position', async () => {
      const result = await getGeolocation();
        
      expect(result).toBe('51.1,45.3');
    });

    it.skip('should return undefined', async () => {
      const mockNavigator = {}
      global.navigator = mockNavigator;
      const result = await getGeolocation();

      expect(result).toBeUndefined()
    })
  });

  describe('getHeaders', () => {
    it('should get an object with two headers', () => {
      const headersObj = getHeaders({authorization: '123'}, {geolocation: '51.1,45.3'})

      expect(Object.keys(headersObj)).toHaveLength(2);
    });

    it('should get an object with only 1 header', () => {
      const headersObj = getHeaders({authorization: '123'}, {geolocation: undefined});

      expect(Object.keys(headersObj)).toHaveLength(1);
    })
  })
})