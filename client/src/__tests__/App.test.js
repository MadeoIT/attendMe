import React from 'react';
import { App, AppConnected } from '../App';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

const initialState = { auth: { isAuthorized: true } }

it('renders without crashing', () => {
  const Component = shallow(<App auth={initialState}/>);

  expect(Component).toBeDefined();
});

it('should find the defualt state', () => { 
  const mockStore = configureStore();
  const store = mockStore(initialState)
  const Component = shallow(<AppConnected store={store} />);

  expect(Component.prop('auth')).toMatchObject({ isAuthorized: true });
})
