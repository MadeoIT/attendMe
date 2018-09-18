/**
 * CSS class convention naming: 
 * 1- name of the component (camelCase not capitalize)
 * 2- type of element (Ex: input, th, ul)
 * 3- name of the props
 * Ex: todoList-tr-content
 */

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

exports.generateEmployesArray = () => ([
  {
    email: 'email@email.com',
    updatedAt: '2018-09-11T08:32:41.849Z',
    createdAt: '2018-09-11T08:32:41.849Z',
    lastName: 'lastName',
    userName: 'userName',
    firstName: 'firstName',
    streetAddress: 'address 28 A',
    postCode: '28103',
    country: 'Finland',
    state: null,
    registered: true,
    tenantId: 1,
    id: 1
  },
  {
    email: 'email2@email.com',
    updatedAt: '2018-09-11T08:32:41.849Z',
    createdAt: '2018-09-11T08:32:41.849Z',
    lastName: 'lastName2',
    userName: 'userName2',
    firstName: 'firstName',
    streetAddress: 'address 28 A',
    postCode: '28103',
    country: 'Finland',
    state: null,
    registered: true,
    tenantId: 1,
    id: 2
  },
  {
    email: 'email3@email.com',
    updatedAt: '2018-09-11T08:32:41.849Z',
    createdAt: '2018-09-11T08:32:41.849Z',
    lastName: 'lastName3',
    userName: 'userName3',
    firstName: 'firstName3',
    streetAddress: 'address 28 A',
    postCode: '28103',
    country: 'Finland',
    state: null,
    registered: false,
    tenantId: 1,
    id: 3
  }
]);

it('__', () => { });