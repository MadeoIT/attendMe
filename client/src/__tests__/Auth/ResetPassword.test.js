import React from 'react';
import { ResetPassword } from '../../Component/Auth/ResetPassword';
import { shallow } from 'enzyme';

describe('ResetPassword component', () => {
  let Component, spyFormSubmit;
  const resetPassword = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    spyFormSubmit = jest.spyOn(ResetPassword.prototype, 'onFormSubmit');
    Component = shallow(<ResetPassword
      match={{ params: { tokenId: 'tokenId' } }}
      resetPassword={resetPassword}
      onError={onError}
    />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should change the password props', () => {
    Component.find('.password')
      .simulate('change', { target: { name: 'password', value: '12345678' } });
    Component.update();

    expect(Component.find('.password').prop('value')).toEqual('12345678');
  });

  it('should submit the form with the new password', () => {
    Component.find('.password')
      .simulate('change', { target: { name: 'password', value: '12345678' } });
    Component.find('.confirm-password')
      .simulate('change', { target: { name: 'confirmPassword', value: '12345678' } });
    Component.update();
    Component.find('.password-form').simulate('submit', { preventDefault() { } });
    Component.update();

    expect(spyFormSubmit).toHaveBeenCalled();
    expect(resetPassword.mock.calls[0][0]).toBe('tokenId');
    expect(resetPassword.mock.calls[0][1]).toBe('12345678');
  })
});