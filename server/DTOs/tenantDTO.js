const R = require('ramda');

module.exports = {
  /**
   * @param {Object} tenant
   * @returns {Object}
   * Split the tenant object into 3 object for: identity, userInfo, tenant, address
   */
  tenantDTOtoTenant: (tenant) => {
    return {
      identityObj: R.pick(['email', 'password', 'googleId', 'facebookId'], tenant) ,
      userInfoObj: R.pick(['firsName', 'lastName', 'userName'], tenant),
      addressObj: R.pick(['type', 'streetAddress', 'postCode', 'country', 'state'], tenant),
      tenantObj: {} 
    }
  },

  /**
   * Compose back an object associating all the props for the related tenant
   */
  tenantToTenantDTO: R.curry((identityObj, userInfoObj, addressObj, tenantObj) => {
    return { 
      ...R.omit(['password', 'id', 'tenantId', 'employeeId', 'createdAt', 'updatedAt'], identityObj),
      ...R.omit(['id', 'tenantId', 'employeeId', 'createdAt', 'updatedAt'], userInfoObj), 
      ...R.omit(['id', 'tenantId', 'employeeId', 'createdAt', 'updatedAt'], addressObj), 
      ...tenantObj 
    }
  })
}