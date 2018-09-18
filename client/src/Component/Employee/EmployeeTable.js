import React from 'react';
import { Table } from 'semantic-ui-react'

const renderEmployeeTableRow = (employes) => employes.map(employee => {
  return (
    <Table.Row key={employee.id} className="employeeTable-tableRow">
      <Table.Cell className="employeeTable-tableCell-email">{employee.email}</Table.Cell>
      <Table.Cell className="employeeTable-tableCell-fullName">
        {`${employee.lastName} ${employee.firstName}`}
      </Table.Cell>
      <Table.Cell className="employeeTable-tableCell-registered">
        { employee.registered ? 'Joined' : 'Pending' }
      </Table.Cell>
    </Table.Row>
  )
})

const EmployeeTable = (props) => {
  return (
    <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Full Name</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {renderEmployeeTableRow(props.employes)}
    </Table.Body>

  </Table>
  )
}

export default EmployeeTable;