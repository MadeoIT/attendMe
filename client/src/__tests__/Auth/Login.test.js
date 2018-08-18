import React from 'react';
import moxios from '@anilanar/moxios';
import { mount } from 'enzyme';
import Root from '../../Root';
import LoginConnected, { Login } from '../../Component/Auth/Login';

describe('Login', () => {
  let Component;
  let ComponentConnected;

  beforeEach(() => {
    moxios.install();
    Component = mount(<Login />);
    ComponentConnected = mount(<Root><LoginConnected /></Root>);
  });

  afterEach(() => {
    moxios.uninstall();
    Component.unmount();
    ComponentConnected.unmount();
  });

  it('should check initial state', () => {
    expect(ComponentConnected.find('Login').prop('auth')).toMatchObject({ isAuthorized: false })
  })

  it('should set the credential in the state', () => {
    Component
      .find('.login-email')
      .simulate('change', { target: {name: 'email', value: 'my@email.com'}});
    Component.update();

    expect(Component.find('.login-email').prop('value')).toEqual('my@email.com');
  });

  it('Should login a user and receive a csrf token', (done) => {
    ComponentConnected.find('.login-form').simulate('submit');
    
    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: { csrfToken: '123' }
      })
      .then(() => {
        ComponentConnected.update();

        expect(ComponentConnected.find('Login').prop('auth')).toMatchObject({ isAuthorized: true })
        done();
      })
    })    
  })
})