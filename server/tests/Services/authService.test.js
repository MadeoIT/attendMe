const { signup } = require('../../Services/authService');
const mock = require('../sharedBehaviours');
let tenantService = require('../../Services/tenantService');
let notification = require('../../middleware/notification');

describe.skip('Auth Service', () => {

  beforeEach(() => {
    
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  describe('signup', () => {
    it('should signup a tenant', async () => {
      tenantService.saveTenant = jest.fn().mockResolvedValue(mock.generateTenantObjFromDB());
      notification.sendNotification = jest.fn().mockResolvedValue(() => () => {});
      const req = { body: mock.generateTenantObj() }
      const res = { status: () => ({ send: (data) => data }) }
      const next = () => {};
      
      await signup(req, res, next);

      expect(tenantService.saveTenant).toHaveBeenCalledWith(req.body);
      expect(notification.sendNotification.mock.calls[0][1]).toBe(req.body.email);
    })
  })
})