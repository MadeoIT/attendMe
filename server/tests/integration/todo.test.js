const request = require('supertest');
const db = require('../../models');

describe.skip('Todo integration test', () => {
  let server;
  const baseUrl = '/api/todos'

  beforeEach(() => {
    server = require('../../app');
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

  it('should add a todo and foreign key', async () => {
    const tenant = await db.Tenant.create({
      email: 'matteo@emil.com',
      password: '123'
    });

    const foreignKeyId = tenant.id;

    const todoObj = {
      content: 'Study more nodejs',
      completed: false,
      tenantId: foreignKeyId
    };


    const res = await request(server)
      .post(baseUrl)
      .send(todoObj);

    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Study more nodejs');
    expect(res.body.tenantId).toBe(foreignKeyId);
  });

  describe('find by id, find all, update', () => {
    let todoId;

    beforeEach(async () => {
      const result = await Promise.all([
        db.Todo.create({
          content: 'title1',
          completed: false
        }),
        db.Todo.create({
          content: 'title2',
          completed: false
        }),
        db.Todo.create({
          content: 'title3',
          completed: false
        })
      ]);
      todoId = result[1].id;
    });

    it('should find a list of todos', async () => {
      const res = await request(server)
        .get(baseUrl);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(3);
    });

    it('should find a todo by id', async () => {
      const res = await request(server)
        .get(`${baseUrl}/${todoId}`)

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('title2');
    });

    it('should not find a todo and throw 404', async () => {
      const res = await request(server)
        .get(`${baseUrl}/4`)

      expect(res.status).toBe(404);
    });

    it('should update todo', async () => {
      const todoUpdate = {
        content: 'title2 Updated',
        completed: false
      };

      const res = await request(server)
        .put(`${baseUrl}/${todoId}`)
        .send(todoUpdate);

      expect(res.status).toBe(200);
      expect(res.body.content).toBe('title2 Updated');
    })

    it('should remove a todo', async () => {
      const res = await request(server)
        .delete(`${baseUrl}/${todoId}`);
      const remainingTodos = await db.Todo.findAll();

      expect(res.status).toBe(200);
      expect(remainingTodos).toHaveLength(2);
    })
  });
})