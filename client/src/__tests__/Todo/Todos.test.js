import React from 'react';
import Todos from '../../Component/Todo/Todos';
import { mount } from 'enzyme';
import Root from '../../Root';
import moxios from '@anilanar/moxios';

const DOMelems = {
  todoTableRow: '.todos-tr',
  todoContent: '.todos-content'
}

describe('Todos', () => {

  const baseUrl = process.env.BASE_URL;
  let Component;

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    Component.unmount();
  });

  describe('Normal', () => {
    beforeEach(() => {
      moxios.stubRequest(`${baseUrl}/api/todos`, {
        status: 200,
        response: [
          { name: 'Todo1', id: 1 },
          { name: 'Todo2', id: 2 },
          { name: 'Todo3', id: 3 }
        ]
      });
      Component = mount(<Root><Todos /></Root>);
    });

    describe('Api actions / GET', () => {
      it('should render a list of todos', (done) => {
        moxios.wait(() => {
          Component.update();

          expect(Component.find(DOMelems.todoTableRow).length).toBe(3);
          done();
        })
      });
    });

    describe('Api actions / POST', () => {
      it('should update the state with the typed value', () => {
        Component
          .find(DOMelems.todoContent)
          .simulate('change', { target: { name: 'content', value: 'first todo' } });
        Component.update();

        expect(Component.find(DOMelems.todoContent).prop('value')).toEqual('first todo');
      });

      it('should post a todo and and find a list of 4 todos', (done) => {
        Component
          .find('.todos-form')
          .simulate('submit');
        Component.update();

        //Moxios is bugged
        moxios.wait(() => {
          let request = moxios.requests.mostRecent()
          request.respondWith({
            status: 200,
            response: { name: 'Todo4', id: 4 }
          })
            .then(() => {
              Component.update();

              expect(Component.find(DOMelems.todoTableRow).length).toEqual(4);
              done();
            });
        });
      });
    });

    describe('Api action / DELETE', () => {
      it('should delete a todo', (done) => {
        Component.update();
        Component
          .find('.todos-delete')
          .at(0)
          .simulate('click')
        Component.update();

        moxios.wait(() => {
          let request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: { id: 1 }
          })
            .then(() => {
              Component.update();

              expect(Component.find(DOMelems.todoTableRow).length).toEqual(2);
              done();
            })
        })
      })
    })
  });

  describe('Exception and edge cases', () => {
    it('should return a 401', (done) => {
      moxios.stubRequest(`${baseUrl}/api/todos`, {
        status: 401,
        response: {}
      });
      Component = mount(<Root><Todos /></Root>);
      moxios.wait(() => {
        Component.update();

        expect(Component.find(DOMelems.todoTableRow).length).toBe(0);
        done();
      });
    });
  });
});