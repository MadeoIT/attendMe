import React from 'react';
import { FlashMessages } from '../../Component/FlashMessages/FlashMessages';
import { shallow } from 'enzyme';

describe('Flash messages', () => {
  let Component;

  beforeEach(() => {
    
  });

  afterEach(() => {
    Component.unmount
  });

  it('Should render the message component', () => {
    const error = 'Error';
    Component = shallow(<FlashMessages error={error} />);

    expect(Component.find('Message')).toHaveLength(1);
  });

  it('Should NOT render a message component', () => {
    const error = null
    Component = shallow(<FlashMessages error={error} />);

    expect(Component.find('Message')).toHaveLength(0)
  });
})