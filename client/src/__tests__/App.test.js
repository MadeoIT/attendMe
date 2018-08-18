import React from 'react';
import { App, AppConnected } from '../App';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

it('renders without crashing', () => {
  const Component = shallow(<App />);

  expect(Component).toBeDefined();
});

it('should find the defualt state', () => {
  const initialState = { auth: { isAuthorized: true } }
  const mockStore = configureStore();
  const store = mockStore(initialState)
  const Component = shallow(<AppConnected store={store} />);

  expect(Component.prop('auth')).toMatchObject({ isAuthorized: true });
})
