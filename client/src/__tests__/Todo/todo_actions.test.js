import * as todoActions from '../../Component/Todo/todo_actions';
import moxios from 'moxios';

describe('Todo Actions', () => {
  const baseUrl = process.env.BASE_URL;

  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(`${baseUrl}/api/todos`, {
      response: 401
    })
  })

  it('should get a todos list', () => {
     
  })
})
