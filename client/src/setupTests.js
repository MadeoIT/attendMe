import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });

const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => Promise.resolve(success({
      coords: {
        latitude: 51.1,
        longitude: 45.3
      }
    })))
}
global.navigator.geolocation = mockGeolocation;

//if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
//  process.on('unhandledRejection', reason => {
//    throw reason
//  })
//  // Avoid memory leak by adding too many listeners
//  process.env.LISTENING_TO_UNHANDLED_REJECTION = true
//}