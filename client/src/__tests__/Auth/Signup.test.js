import React from 'react';
import SignupConnected, { Signup } from "../../Component/Auth/Signup";
import Root from '../../Root';
import moxios from 'moxios';
import { mount, shallow } from 'enzyme';

describe('Auth Components', () => {
  describe('Signup Component', () => {
    let Component;

    beforeEach(() => {
      moxios.install();
      Component = shallow(<Signup />)
    });

    afterEach(() => {
      Component.unmount();
      moxios.uninstall();
    });

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

    it.skip('should sign up a user', (done) => {
      const spy = jest.spyOn(Signup.prototype, 'onFormSubmit');
      //const Component = mount(<Si />);
      Component.find('.signup-form').simulate('submit');
      Component.update();

      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: {}
        }).then(() => {

          expect(spy).toHaveBeenCalled();
          done();
        }).catch(err => {
          console.log(err)
          done()
        })
      })
    })
  });
});