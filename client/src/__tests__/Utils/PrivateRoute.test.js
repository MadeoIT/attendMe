import React from 'react';
import { shallow, mount } from 'enzyme';
import PrivateRoute from '../../Utils/PrivateRoute';
import { MemoryRouter, Switch } from 'react-router-dom';

describe('Private route', () => {

  it('should render without crash', () => {
    const Component = shallow(<PrivateRoute />);

    expect(Component.find('Route')).toHaveLength(1);
  });

  describe('Access', () => {
  
    const FakeComponent = () => <div></div>;
    const mountComponentWithProp = (authProp) => {
      return mount(
        <MemoryRouter initialEntries={['/todos']} >
          <PrivateRoute component={FakeComponent} auth={authProp} />
        </MemoryRouter>
      )
    }

    it('should grant access to the page', () => {
      const authProp = { isAuthorized: false };
      const Component = mountComponentWithProp(authProp);

      expect(Component.find('Redirect')).toHaveLength(1);
      expect(Component.find('FakeComponent')).toHaveLength(0);
      Component.unmount();
    });
  
    it('should grant access to the page', () => {
      const authProp = { isAuthorized: true };
      const Component = mountComponentWithProp(authProp);
  
      expect(Component.find('Redirect')).toHaveLength(0);
      expect(Component.find('FakeComponent')).toHaveLength(1);
      Component.unmount();
    });
  });
});