import React from 'react';
import { Button, Checkbox, Form, Segment, Divider } from 'semantic-ui-react'

const TenantInfo = (props) => {
  return (
    <Form
      loading={props.loading > 0 ? true : false}
      className="tenantInfo-form"
      onSubmit={(e) => props.onFormSubmit(e)}
    >

      {/* Identity */}
      <Form.Input
        fluid icon='mail' iconPosition='left'
        required
        className="tenantInfo-input-email"
        name="email"
        onChange={(e) => props.onChange(e)}
        type="email"
        value={props.tenant.email || ''}
        placeholder='Email'
      />

      {/* User Info */}
      <Divider horizontal>Info</Divider>

      <Form.Input
        className="tenantInfo-input-firstName"
        name="firstName"
        onChange={(e) => props.onChange(e)}
        type="text"
        value={props.tenant.firstName || ''}
        placeholder='First name'
      />

      <Form.Input
        className="tenantInfo-input-lastName"
        name="lastName"
        onChange={(e) => props.onChange(e)}
        type="text"
        value={props.tenant.lastName || ''}
        placeholder='Last name'
      />

      <Form.Input
        className="tenantInfo-input-userName"
        name="userName"
        onChange={(e) => props.onChange(e)}
        type="text"
        value={props.tenant.userName || ''}
        placeholder='User name'
      />

      {/* Address */}
      <Divider horizontal>Address</Divider>

      <Form.Input
        fluid icon='address book' iconPosition='left'
        required
        className="tenantInfo-input-streetAddress"
        name="streetAddress"
        onChange={(e) => props.onChange(e)}
        type="streetAddress"
        value={props.tenant.streetAddress || ''}
        placeholder='Address'
      />

      <Form.Input
        required
        className="tenantInfo-input-postCode"
        name="postCode"
        onChange={(e) => props.onChange(e)}
        type="postCode"
        value={props.tenant.postCode || ''}
        placeholder='Post code'
      />

      <Form.Input
        required
        className="tenantInfo-input-country"
        name="country"
        onChange={(e) => props.onChange(e)}
        type="country"
        value={props.tenant.country || ''}
        placeholder='Country'
      />

      <Button primary size='large'>Save</Button>
    </Form>

  )
}

export default TenantInfo;