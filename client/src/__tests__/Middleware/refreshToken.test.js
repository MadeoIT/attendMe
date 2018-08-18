import refreshToken from '../../Middlewares/refreshToken';
import moxios from 'moxios';
import { todoUrl } from '../../Component/Todo/todo_actions';

const baseUrl = process.env.BASE_URL

describe('Refresh token middleware', () => {
  let fakeStore, fakeNext;

  const onSuccess = (data) => data;
  const action = {
    type: 'INVALID_TOKEN',
    payload: { request: [todoUrl, { name: 'todo1' }], method: 'post', onSuccess }
  };

  beforeEach(() => {
    fakeStore = {
      dispatch: jest.fn()
    };
    fakeNext = jest.fn()
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should dispatch the previous action / valid token', (done) => {
    moxios.stubRequest(`${baseUrl}/api/auth/relogin`, {
      status: 200,
      response: {}
    });
    moxios.stubRequest(todoUrl, {
      status: 200,
      response: [{ name: 'todo1' }, { name: 'todo2' }]
    });

    refreshToken(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(2);
      expect(fakeStore.dispatch).toHaveBeenCalledWith(expect.arrayContaining([{ name: 'todo1' }]));
      expect(fakeNext).not.toHaveBeenCalled();
      done();
    })
  });

  it('should dispatch an error action / fail to obtain a new token', (done) => {
    moxios.stubRequest(`${baseUrl}/api/auth/relogin`, {
      status: 401,
      response: {}
    });

    refreshToken(fakeStore)(fakeNext)(action);

    moxios.wait(() => {
      expect(fakeStore.dispatch).toHaveBeenCalledTimes(2);
      done();
    })
  });

  it('should pass action to the next middleware', () => {
    const anotherAction = {
      type: 'SOME_OTHER_TYPE',
      payload: { request: [todoUrl, { name: 'todo1' }], method: 'post', onSuccess }
    };
    refreshToken(fakeStore)(fakeNext)(anotherAction);

    expect(fakeNext).toHaveBeenCalledWith(anotherAction);
    expect(fakeStore.dispatch).not.toHaveBeenCalled();
  })
})