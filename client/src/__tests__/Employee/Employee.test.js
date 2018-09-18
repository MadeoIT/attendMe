import React from 'react';
import { shallow } from 'enzyme';
import { Employee } from '../../Component/Employee/Employee';
import mocks from '../mocks';

describe('Employee', () => {
  let Component, onClickSpy, onUploadSpy;
  const employesArray = mocks.generateEmployesArray();
  const getEmployesSpy = jest.fn();
  const sendEmailInvitation = jest.fn();
  const sendEmailInvitations = jest.fn();
  const match = { params: { tenantId: 1 } }
  const event = { target: { name: 'email', value: 'email@email.com' } };
  const uploadEvent = { target: { files: ['emailList.csv'] } };

  beforeEach(() => {
    onClickSpy = jest.spyOn(Employee.prototype, 'onClick');
    onUploadSpy = jest.spyOn(Employee.prototype, 'onUpload');
    Component = shallow(<Employee
      employee={employesArray}
      getEmployes={getEmployesSpy}
      math={match}
      sendEmailInvitation={sendEmailInvitation}
      sendEmailInvitations={sendEmailInvitations}
    />);
  });

  it('should render without crash', () => {
    expect(Component).toBeDefined();
    expect(getEmployesSpy).toHaveBeenCalledWith(match.params.tenantId);
  });

  it('should render a table of employes and attributes', () => {
    expect(Component
      .find('EmployeeTable')
      .dive()
      .find('.employeeTable-tableCell-email')
      .at(0)
      .render()
      .text()
    ).toEqual(employesArray[0].email);
    expect(Component
      .find('EmployeeTable')
      .dive()
      .find('.employeeTable-tableCell-registered')
      .at(0)
      .render()
      .text()
    ).toEqual('Joined');
  });

  it('should should type an email', () => {
    Component
      .find('EmployeeAdd')
      .dive()
      .find('.employeeAdd-input-email')
      .simulate('change', event);
    Component.update();

    expect(Component
      .find('EmployeeAdd')
      .dive()
      .find('.employeeAdd-input-email')
      .prop('value')
    ).toEqual(event.target.value);
  })

  it('should call sendEmailInvitation method', () => {
    Component
      .find('EmployeeAdd')
      .dive()
      .find('.employeeAdd-input-email')
      .simulate('change', event);
    Component.update();
    Component
      .find('EmployeeAdd')
      .dive()
      .find('.employeeAdd-button-email')
      .simulate('click')
    Component.update();

    expect(onClickSpy).toHaveBeenCalled();
    expect(sendEmailInvitation).toHaveBeenCalledWith(
      { [event.target.name]: event.target.value }, 
      match.params.tenantId
    );
  });

  it('should upload a file', () => {
    Component
      .find('EmployeeAdd')
      .dive()
      .find('.employeeAdd-input-upload')
      .simulate('change', uploadEvent)
    Component.update();

    expect(onUploadSpy).toHaveBeenCalled();
    expect(sendEmailInvitations).toHaveBeenCalledWith(
      { file: uploadEvent.target.files[0] },
      match.params.tenantId
    )
  })
})