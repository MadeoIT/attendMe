const request = require('supertest');
const db = require('../../models');

//This helpers create a user tenant with valid token and csrf token
const {
  generateTenant,
  generateTokenAndCsrfToken,
  generateFakeTodoObj,
  generateFakeTenantObj
} = require('../sharedBehaviours');

describe('Todo integration test', () => {
  let server, token, csrfToken, tenant_FK;
  const baseUrl = '/api/todos'

  beforeEach(async () => {
    server = require('../../app');
    const fakeTenant = generateFakeTenantObj()
    const tenant = await generateTenant(fakeTenant);
    result = generateTokenAndCsrfToken(tenant);
    token = result.token;
    csrfToken = result.csrfToken;
    tenant_FK = tenant.id;
  });

  afterEach(async () => {
    server.close();
    await Promise.all([
      db.Todo.destroy({
        where: {},
        truncate: true
      }),
      db.Tenant.destroy({
        where: {}
      })
    ])
  });

  //TODO: bugged test
  it('should add a todo and foreign key', async () => {
    const fakeTodo = generateFakeTodoObj();

    const res = await request(server)
      .post(baseUrl)
      .set('Cookie', `token=${token}`)
      .set('csrf-token', csrfToken)
      .send(fakeTodo);

    expect(res.status).toBe(200);
    expect(res.body.content).toBe(fakeTodo.content);
    expect(res.body.tenantId).toBe(tenant_FK);
  });

  describe('find by id, find all, update', () => {
    let todoId, result;
    const fakeTodo1 = generateFakeTodoObj();
    const fakeTodo2 = generateFakeTodoObj();
    const fakeTodo3 = generateFakeTodoObj();

    beforeEach(async () => {
      result = await Promise.all([
        db.Todo.create({
          ...fakeTodo1,
          tenantId: tenant_FK
        }),
        db.Todo.create({
          ...fakeTodo2,
          tenantId: tenant_FK
        }),
        db.Todo.create({
          ...fakeTodo3
        })
      ]);
      todoId = result[1].id;
      todoId2 = result[0].id;
    });

    it('should find a list of todos', async () => {
      const res = await request(server)
        .get(baseUrl)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('should find a todo by id', async () => {
      const res = await request(server)
        .get(`${baseUrl}/${todoId}`)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.content).toBe(fakeTodo2.content);
    });

    it('should not find a todo and throw 404', async () => {
      const res = await request(server)
        .get(`${baseUrl}/4`)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      expect(res.status).toBe(404);
    });

    it('should update todo', async () => {
      const todoUpdate = {
        content: fakeTodo2 + 'updated',
        completed: true
      };

      const res = await request(server)
        .put(`${baseUrl}/${todoId}`)
        .send(todoUpdate)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.content).toBe(fakeTodo2 + 'updated');
      expect(res.body.completed).toBeTruthy();
    });

    it('should batch update todos', async () => {
      const body = [
        { id: todoId, content: 'todo1 updated', completed: true, modified: true },
        { id: todoId2, content: 'todo2 updated', completed: false, modified: true },
        { id: 23, content: 'todo2', completed: false }
      ]

      const res = await request(server)
        .put(`${baseUrl}`)
        .send(body)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].content).toBe(body[0].content);
    })

    it('should remove a todo', async () => {
      const res = await request(server)
        .delete(`${baseUrl}/${todoId}`)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', csrfToken);

      const remainingTodos = await db.Todo.findAll();

      expect(res.status).toBe(200);
      expect(remainingTodos).toHaveLength(2);
    });

    //Auth edge cases
    it('should return 401 because wrong csrf token', async () => {
      const res = await request(server)
        .get(baseUrl)
        .set('Cookie', `token=${token}`)
        .set('csrf-token', 'wrongCsrfToken');

      expect(res.status).toBe(401);
    });
  });
})