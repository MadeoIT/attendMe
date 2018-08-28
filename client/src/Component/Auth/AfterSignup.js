import React from 'react';
import { Message, Segment, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

const AfterSignup = () => {
  return (
    <Grid centered columns={2}><br />
      <Grid.Column>
        <Segment raised>
          <Message>
            <Message.Item>If you did not receive any message click to re-send the email</Message.Item>
            <Message.Item>Your confirmation will expire after 5 minutes</Message.Item>
            <p>Please check your spam folder before.</p>
          </Message>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default connect(null, null)(AfterSignup);