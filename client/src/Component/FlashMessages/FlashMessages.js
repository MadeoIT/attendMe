import React from 'react';
import { connect } from 'react-redux';
import { Message, Segment, Grid } from 'semantic-ui-react';
import * as actions from '../../Actions/error_actions';

export class FlashMessages extends React.Component {

  componentDidUpdate(){
    if(this.props.error && typeof this.props.error === 'string') {
      setTimeout(() => {
        this.props.resetErrorState();
      }, 4000);
    }
  }

  render() {
    return this.props.error ? (
      <Grid centered columns={2}><br />
        <Grid.Column>
          <Segment raised>
            <Message negative>
              <Message.Header>{this.props.error}</Message.Header>
            </Message>
          </Segment>
        </Grid.Column>
      </Grid>
    ) : null
  }
};

const mapStateToProps = state => ({
  error: state.error
});

export default connect(mapStateToProps, actions)(FlashMessages);