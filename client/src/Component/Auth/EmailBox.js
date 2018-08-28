import React from 'react'
import { Modal, Form, Button } from 'semantic-ui-react'

const EmailBox = ({ isModalOpen, toggle, resetEmail, onChange, onSubmitEmail }) => (
  <Modal
    size='tiny'
    open={isModalOpen}
    onClose={toggle}
  >
    <Modal.Header>Insert your email</Modal.Header>
    <Modal.Content>
      <Form onSubmit={onSubmitEmail}>
        <Form.Input
          fluid icon='mail' iconPosition='left'
          required
          type="email"
          className="reset-email"
          name="resetEmail"
          onChange={(e) => onChange(e)}
          value={resetEmail || ''}
        />
        <Button size='tiny' primary >Send</Button>
      </Form>
    </Modal.Content>

  </Modal>
)

export default EmailBox