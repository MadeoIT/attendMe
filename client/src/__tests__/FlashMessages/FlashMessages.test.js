import React from 'react';
import { FlashMessages } from '../../Component/FlashMessages/FlashMessages';
import { shallow } from 'enzyme';

describe('Flash messages', () => {
  let Component;

  it('Should render the error message component', () => {
    const error = 'Error';
    Component = shallow(<FlashMessages error={error} />);

    expect(Component.find('Message')).toHaveLength(1);
  });

  it('Should NOT render a error message component', () => {
    const error = null
    Component = shallow(<FlashMessages error={error} />);

    expect(Component.find('Message')).toHaveLength(0)
  });

  it('Should render a success message component', () => {
    const message = {header: 'test', content: 'test'}
    Component = shallow(<FlashMessages message={message} />);

    expect(Component.find('Message')).toHaveLength(1);
  });
})