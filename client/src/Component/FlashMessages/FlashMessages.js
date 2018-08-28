import React from 'react';
import { connect } from 'react-redux';
import { Message, Segment, Grid } from 'semantic-ui-react';
import { resetErrorState } from '../../Actions/error_actions';
import { resetMessageState } from '../../Actions/message_actions';

export class FlashMessages extends React.Component {

  componentDidUpdate() {
    if (this.props.error && typeof this.props.error === 'string') {
      setTimeout(() => {
        this.props.resetErrorState();
      }, 5000);
    };

    if (this.props.message) {
      setTimeout(() => {
        this.props.resetMessageState();
      }, 5000);
    };
  }

  render() {
    const { error, message } = this.props;

    const renderMessage = (props) => {
      if (props.error) {
        return (
          <Message negative >
            <Message.Header>{error}</Message.Header>
          </Message>
        )
      }
      if (props.message) {
        return (
          <Message success >
            <Message.Header>{message.header}</Message.Header>
            <Message.Content>{message.content}</Message.Content>
          </Message>
        )
      }
    }

    return error || message ? (
      <Grid centered columns={2}><br />
        <Grid.Column>
          <Segment raised>
            {renderMessage(this.props)}
          </Segment>
        </Grid.Column>
      </Grid>
    ) : null
  }
};

const mapStateToProps = state => ({
  error: state.error,
  message: state.message
});

export default connect(mapStateToProps, { resetErrorState, resetMessageState })(FlashMessages);