import React from 'react';
import { Form, Button, Divider, Label } from 'semantic-ui-react';


const EmployeeAdd = (props) => {
  return (
    <div>
      <Form.Input
        fluid icon='mail' iconPosition='left'
        required
        className="employeeAdd-input-email"
        name="email"
        onChange={(e) => props.onChange(e)}
        type="email"
        value={props.email || ''}
        placeholder='Email'
      />
      <Button
        className='employeeAdd-button-email'
        primary size='large'
        onClick={props.onClick}
      >
        Send
      </Button>
      <Divider />

      <Label
        as="label"
        basic
        htmlFor="upload"
      >
        <input 
          type="file" id="upload"
          className='employeeAdd-input-upload'
          hidden
          onChange={(e) => props.onUpload(e)}
        />
      </Label>
    </div>
  )
}

export default EmployeeAdd;