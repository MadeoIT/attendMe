import api from '../../Middlewares/api';
import moxios from 'moxios';
import { todoUrl } from '../../Component/Todo/todo_actions';
import { onError } from '../../Actions/error_actions';

describe('Api Middleware', () => {
  let fakeNext, fakeStore;

  beforeEach(() => {
    moxios.install();
    fakeNext = jest.fn()
    fakeStore = { dispatch: jest.fn() };
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should call dispatch a GET action', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: [{ name: 'todo1' }, { name: 'todo2' }]
    });
    const onSuccess = (data) => data;
    const action = {
      type: 'API',
      payload: { request: [todoUrl], method: 'get', onSuccess }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledWith(expect.arrayContaining([{ name: 'todo1' }]));
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  })

  it('should call dispatch correctly the action', (done) => {
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: { name: 'todo1' }
    });
    const onSuccess = (data) => data;
    const action = {
      type: 'API',
      payload: { request: [todoUrl, { name: 'todo1' }], method: 'post', onSuccess }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledWith({ name: 'todo1' })
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  });

  it('should pass action the action to the next middleware', (done) => {
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
      payload: { request: [todoUrl], method: 'get' }
    }
    api(fakeStore)(fakeNext)(action);

    //TODO: add haveBeenCalledWith
    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(2);
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
      payload: { request: [todoUrl], method: 'get' }
    }
    api(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeNext).not.toHaveBeenCalled()
      done();
    });
  });
});