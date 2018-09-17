import { shallow } from 'enzyme';
import {TenantDashboard} from '../../Component/TenantDashboard/TenantDashboard';
import React from 'react';
import mocks from '../mocks';

describe('TenantDashboard component', () => {
  let Component;
  const tenantObj = mocks.generateTenantObjFromDB();
  const match = {params: {tenantId: tenantObj.id}}
  const getTenantSpy = jest.fn();
  const loading = 0;

  beforeEach(() => {
    Component = shallow(<TenantDashboard 
      tenant={tenantObj}
      match={match}
      getTenant={getTenantSpy}
      loading={loading}
    />);
      
  });

  it('should render without crashing', () => {
    expect(Component).toBeDefined();
    expect(getTenantSpy).toHaveBeenCalledWith(tenantObj.id);
  });

  it('should contain Tenant info', () => {
    expect(Component
      .find('TenantInfo')
      .dive()
      .find('.tenantInfo-input-email')
      .prop('value')
    ).toEqual(tenantObj.email);
    expect(Component
      .find('TenantInfo')
      .dive()
      .find('FormInput')
    ).toHaveLength(7);
  });

  it('should contain Tenant Card', () => {
    expect(Component
      .find('TenantCard')
      .dive()
      .find('.tenantCard-header')
      .render()
      .text()
    ).toEqual(`${tenantObj.firstName} ${tenantObj.lastName}`);
    expect(Component
      .find('TenantCard')
      .dive()
      .find('.tenantCard-meta-date')
      .render()
      .text()
    ).toEqual('Joined in 2018')
  })
})