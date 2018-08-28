import React from 'react';
import { Segment, Grid, Form, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from './auth_actions';

export class ResetPassword extends React.Component {
  constructor(...args) {
    super(...args);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {}
  }

  onFormSubmit(e) {
    e.preventDefault();

    const { password, confirmPassword } = this.state;

    if (password.length < 8) return this.props.onError({
      data: 'Password must be at least 8 character long'
    });

    if (password !== confirmPassword) return this.props.onError({
      data: 'Password does not match'
    });

    this.props.resetPassword(this.props.match.params.tokenId, this.state.password, () => {
      this.props.history.push('/login');
    })
  }

  onChange(e) {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <Grid centered columns={2} > <br />
        <Grid.Column>
          <Segment raised>
            <Form 
              onSubmit={(e) => this.onFormSubmit(e)} 
              className='password-form'
              loading={this.props.loading > 0 ? true : false}
            >
              <Form.Input
                error={false}
                fluid icon='lock' iconPosition='left'
                required
                className="password"
                name="password"
                onChange={(e) => this.onChange(e)}
                type="password"
                value={this.state.password || ''}
                placeholder='New password'
              />
              <Form.Input
                error={false}
                fluid
                required
                className="confirm-password"
                name="confirmPassword"
                onChange={(e) => this.onChange(e)}
                type="password"
                value={this.state.confirmPassword || ''}
                placeholder='Re-type password'
              />
              <Button primary fluid size='large'>Send</Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
};

const mapStateToProps = state => ({
  loading: state.loading
})

export default connect(mapStateToProps, actions)(ResetPassword);
