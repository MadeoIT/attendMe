const tenantDTOs = require('../../DTOs/tenantDTO');
const mock = require('../sharedBehaviours');

describe('Tenant Data Transfer Object', () => {
  it('should convert a TenantObj to identity, address, userinfo, tenant', () => {
    const tenant = mock.generateTenantObj();
    const splittedObject = tenantDTOs.tenantDTOtoTenant(tenant);

    expect(Object.keys(splittedObject)).toHaveLength(4);
    expect(Object.keys(splittedObject.identityObj)).toHaveLength(2);
    expect(Object.keys(splittedObject.addressObj)).toHaveLength(3);
    expect(splittedObject.addressObj.postCode).toBe(tenant.postCode);
    expect(Object.keys(splittedObject.tenantObj)).toHaveLength(0);
  });

  it('should convert to a tenant DTO', () => {
    const identity = mock.generateIdentityFromDb(false);
    const userInfo = mock.generateUserInfoFromDb(false);
    const address = mock.generateAddressFromDb(false);
    const tenant = mock.generateTenantFromDb(false);
    const combinedObj = tenantDTOs.tenantToTenantDTO(identity, userInfo, address, tenant);
    
    expect(Object.keys(combinedObj)).toHaveLength(9);
    expect(combinedObj.password).toBeUndefined();
    expect(combinedObj.tenantId).toBeUndefined();
    expect(combinedObj.id).toBe(1);
  })
})