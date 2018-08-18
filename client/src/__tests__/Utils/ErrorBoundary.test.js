import React from 'react';
import { mount } from 'enzyme';
import ErrorBoundary from '../../Utils/ErrorBoundary';

const BrokenChild = () => {
  throw 'Test error'
}

describe('ErrorBoundary', () => {
  let Component;

  beforeEach(() => {
    Component = mount(
      <ErrorBoundary>
        <BrokenChild />        
      </ErrorBoundary>    
    )
  })

  afterEach(() => {
    Component.unmount();
  })

  it('should throw an error', () => {
    
    expect(Component.find('div.error')).toHaveLength(1)
  })
})