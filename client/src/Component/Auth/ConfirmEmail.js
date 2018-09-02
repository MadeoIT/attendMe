import React from 'react';
import { connect } from 'react-redux';
import { Loader, Message, Segment, Grid } from 'semantic-ui-react';
import * as actions from '../Auth/auth_actions';

class ConfirmEmail extends React.Component {

  componentDidMount() {
    this.props.confirmEmail(this.props.match.params.tokenId)
  }

  render() {

    const renderMessage = (loading) => (
      loading > 0
        ? <Loader active inline='centered'>Loading</Loader>
        : (
          <Message>
            <Message.Item>
              If your confirmation email has expired click here to send it again
            </Message.Item >
            <Message.Item>Your confirmation will expire after 5 minutes</Message.Item>
          </Message>
        )
    )

    return (
      <Grid centered columns={2} > <br />
        <Grid.Column>
          <Segment raised>
            {renderMessage(this.props.loading)}
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
};

const mapStateToProps = state => ({
  loading: state.loading
})



export default connect(mapStateToProps, actions)(ConfirmEmail);