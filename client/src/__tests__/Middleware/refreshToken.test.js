import refreshToken from '../../Middlewares/refreshToken';
import moxios from 'moxios';
import { todoUrl } from '../../Component/Todo/todo_actions';

describe('Refresh token middleware', () => {
  let fakeStore, fakeNext;

  const onSuccess = (data) => data;
  const action = {
    type: 'INVALID_TOKEN',
    payload: { request: { url: todoUrl, data: { name: 'todo1' }, method: 'post' }, onSuccess }
  };

  beforeEach(() => {
    fakeStore = {
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({ auth: { csrfToken: '123' } })
    };
    fakeNext = jest.fn()
    moxios.install();
  });

  afterEach(() => {
    jest.clearAllMocks();
    moxios.uninstall();
  });

  it('should dispatch the previous action / valid token', (done) => {
    moxios.stubRequest('/api/auth/relogin', {
      status: 200,
      response: {}
    });
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: [{ name: 'todo1' }, { name: 'todo2' }]
    });

    refreshToken(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(3);
      expect(fakeStore.dispatch).toHaveBeenCalledWith(expect.arrayContaining([{ name: 'todo1' }]));
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  });

  it('should dispatch an error action / fail to obtain a new token', (done) => {
    moxios.stubRequest('/api/auth/relogin', {
      status: 401,
      response: {}
    });

    refreshToken(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(2);
      expect(fakeStore.dispatch.mock.calls[0][0].payload.status).toEqual(401);
      done();
    })
  });

  it('should pass action to the next middleware', () => {
    const anotherAction = {
      type: 'SOME_OTHER_TYPE',
      payload: { request: { url: todoUrl, data: { name: 'todo1' }, method: 'post' }, onSuccess }
    };
    refreshToken(fakeStore)(fakeNext)(anotherAction);

    expect(fakeNext).toHaveBeenCalledWith(anotherAction);
    expect(fakeStore.dispatch).not.toHaveBeenCalled();
  })
})