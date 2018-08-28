import React from 'react';
import { Signup } from "../../Component/Auth/Signup";
import moxios from 'moxios';
import { shallow } from 'enzyme';

describe('Auth Components', () => {
  describe('Signup Component', () => {
    let Component, spyFormSubmit;
    const signup = jest.fn();
    const onError = jest.fn();

    beforeEach(() => {
      spyFormSubmit = jest.spyOn(Signup.prototype, 'onFormSubmit');
      Component = shallow(<Signup signup={signup} onError={onError}/>);
    });

    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should render without crash', () => {
      expect(Component).toBeDefined();
    });

    it('should set the state after typing credential', () => {
      Component.update();
      Component
        .find('SignupForm')
        .dive()
        .find('.signup-email')
        .simulate('change', { target: { name: 'email', value: 'matteo@email.com' } });
      Component.update();

      expect(Component
        .find('SignupForm')
        .dive()
        .find('.signup-email')
        .prop('value')
      ).toEqual('matteo@email.com');
    });

    it('should submit the form', () => {
      Component
        .find('SignupForm')
        .dive()
        .find('.signup-password')
        .simulate('change', { target: { name: 'password', value: '12345678' } });
      Component
        .find('SignupForm')
        .dive()
        .find('.confirm-password')
        .simulate('change', { target: { name: 'confirmPassword', value: '12345678' } });
      Component.update();
      Component
        .find('SignupForm')
        .dive()
        .find('.signup-form')
        .simulate('submit', { preventDefault() { } });
      Component.update();

      expect(spyFormSubmit).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(signup.mock.calls[0][0]).toEqual({password: '12345678'});
    });

    it('should not submit form / password not matching', () => {
      Component
        .find('SignupForm')
        .dive()
        .find('.signup-password')
        .simulate('change', { target: { name: 'password', value: '12345678' } });
      Component.update();
      Component
        .find('SignupForm')
        .dive()
        .find('.confirm-password')
        .simulate('change', { target: { name: 'confirmPassword', value: 'unmatchingpassword' } });
      Component.update();
      Component
        .find('SignupForm')
        .dive()
        .find('.signup-form')
        .simulate('submit', { preventDefault() { } });
      Component.update();

      expect(spyFormSubmit).toHaveBeenCalled();
      expect(onError.mock.calls[0][0].data).toContain("not match");
      expect(signup).not.toHaveBeenCalled();
    });
  });
});