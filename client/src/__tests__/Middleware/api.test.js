import api from '../../Middlewares/api';
import moxios from 'moxios';
import { todoUrl } from '../../Component/Todo/todo_actions';

describe('Api Middleware', () => {
  let fakeNext, fakeStore;

  beforeEach(() => {
    moxios.install();
    fakeNext = jest.fn()
    fakeStore = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({ auth: { csrfToken: '123' } })
    };
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should make a GET request and dispatch the actions', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: [{ name: 'todo1' }, { name: 'todo2' }]
    });
    const onSuccess = (data) => data;
    const action = {
      type: 'API',
      payload: { request: { url: todoUrl, method: 'get' }, onSuccess, message: 'message' }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledWith(expect.arrayContaining([{ name: 'todo1' }]));
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(4);
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  })

  it('should make a POST request and dispatch the actions', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: { name: 'todo1' }
    });
    const onSuccess = (data) => data;
    const action = {
      type: 'API',
      payload: { request: { url: todoUrl, data: { name: 'todo1' }, method: 'post' }, onSuccess }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledWith({ name: 'todo1' });
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  });

  it('should pass the action to the next middleware', (done) => {
    const action = {
      type: 'NEXT',
      payload: 'data'
    };
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeNext).toHaveBeenCalledWith(action);
      expect(fakeStore.dispatch).not.toHaveBeenCalled();
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(0);
      done();
    })
  });

  it('should dispatch an invalid token action', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 401,
      response: {}
    });
    const action = {
      type: 'API',
      payload: { request: { url: todoUrl, method: 'get' } }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(2);
      expect(fakeStore.dispatch.mock.calls[1][0])
        .toMatchObject({ type: 'INVALID_TOKEN', payload: action.payload })
      done();
    });
  });

  it('should dispatch an error action', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 404,
      response: {}
    });
    const action = {
      type: 'API',
      payload: { request: { url: todoUrl, method: 'get' } }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeStore.dispatch.mock.calls[1][0].payload.status).toEqual(404)
      expect(fakeNext).not.toHaveBeenCalled()
      done();
    });
  });
});