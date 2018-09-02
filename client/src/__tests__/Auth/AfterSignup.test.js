import React from 'react';
import { AfterSignup } from '../../Component/Auth/AfterSignup';
import { shallow } from 'enzyme';

describe('AfterSignup Component', () => {
  let Component, resendConfirmEmail;
  const auth = { email: 'some@email.com' };

  beforeEach(() => {  
    resendConfirmEmail = jest.fn();
    Component = shallow(<AfterSignup
      auth={auth}
      resendConfirmEmail={resendConfirmEmail}
    />);
  })

  it('should send email', () => {
    Component.find('Button').simulate('click');
    Component.update();

    expect(resendConfirmEmail).toHaveBeenCalledWith(auth.email);
  })
})