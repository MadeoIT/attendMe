exports.generateTenantObj = () => ({
  email: 'email@email.com',
  password: 'password',

  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland',

  firstName: 'name',
  lastName: 'lastName',
  userName: 'userName'
});
exports.generateTenantFromDb = () => ({
  id: 1,
  numberOfEmployes: 20
});
exports.generateAddressFromDb = (fk) => ({
  id: 4,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland'
});
exports.generateIdentityFromDb = (fk) => ({
  id: 32,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  email: 'email@email.com',
  password: 'password'
});
exports.generateUserInfoFromDb = (fk) => ({
  id: 23,
  tenantId: 1,
  employeeId: fk ? 2 : null,
  firstName: 'name',
  lastName: 'lastName',
  userName: 'userName'
});
exports.generateTenantObjFromDB = () => ({
  confirmed: true,
  blocked: false,
  email: 'email@email.com',
  updatedAt: '2018-09-11T08:32:41.849Z',
  createdAt: '2018-09-11T08:32:41.849Z',
  googleId: null,
  facebookId: null,
  lastName: 'lastName',
  userName: 'userName',
  firstName: 'firstName',
  streetAddress: 'address 28 A',
  postCode: '28103',
  country: 'Finland',
  type: null,
  state: null,
  isTenant: true,
  id: 1
});

it('__', () => {});