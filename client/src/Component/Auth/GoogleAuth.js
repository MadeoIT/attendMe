import React from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader, Segment, Grid } from 'semantic-ui-react';
import * as actionsAuth from './auth_actions';
import * as actionsMessage from '../../Actions/message_actions';

class GoogleAuth extends React.Component {

  componentDidMount() {
    const { signupGoogle, onMessaage, history, match } = this.props;
    signupGoogle(match.params.tokenId);
    onMessaage('Login successfull');
    history.push('/todos')
  }

  render() {
    return (
      <Grid centered columns={2}><br />
        <Grid.Column>
          <Segment raised>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
};

export default connect(null, {...actionsAuth, ...actionsMessage})(GoogleAuth);