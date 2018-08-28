import React from 'react';
import { shallow } from 'enzyme';
import { Login } from '../../Component/Auth/Login';

describe('Login', () => {
  let Component, spyFormSubmit;
  const login = jest.fn();

  beforeEach(() => {
    spyFormSubmit = jest.spyOn(Login.prototype, 'onFormSubmit');
    Component = shallow(<Login login={login}/>)
  });

  it('should set the credential in the state', () => {
    Component
      .find('LoginForm')
      .dive()
      .find('.login-email')
      .simulate('change', { target: {name: 'email', value: 'my@email.com'}});
    Component.update();

    expect(Component
      .find('LoginForm')
      .dive()
      .find('.login-email')
      .prop('value')
    ).toEqual('my@email.com');
  });

  it('should submit the form', () => {
    Component
      .find('LoginForm')
      .dive()
      .find('.login-form')
      .simulate('submit', { preventDefault() { } });
    Component.update();

    expect(spyFormSubmit).toHaveBeenCalled();
  })
})