import React from 'react';
import { Message, Segment, Grid, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from './auth_actions';

export const AfterSignup = (props) => {
  return (
    <Grid centered columns={2}><br />
      <Grid.Column>
        <Segment raised>
          <Message>
            <Message.Item>
              If you did not receive any message click the button to re-send the email
            </Message.Item>
            <Message.Item>Your confirmation will expire after 5 minutes</Message.Item>
            <p>Please check your spam folder before.</p>
          </Message>
          <Button
            loading={props.loading > 0 ? true : false}
            onClick={() => props.resendConfirmEmail(props.auth.email)}
          >
            Send email
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  loading: state.loading
})

export default connect(mapStateToProps, actions)(AfterSignup);