import React from 'react';
import SignupForm from './SignupForm';
import * as authActions from './auth_actions';
import * as errorActions from '../../Actions/error_actions';
import { connect } from 'react-redux';
import * as R from 'ramda';

export class Signup extends React.Component{
  constructor(...args) {
    super(...args);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    
    this.state = {}
  }

  onFormSubmit(e) {
    e.preventDefault();

    const {password, confirmPassword} = this.state;

    if(password.length < 8) return this.props.onError({
      data: 'Password must be at least 8 character long'
    });

    if(password !== confirmPassword) return this.props.onError({
      data: 'Password does not match'
    });

    const signupData = R.pick(['email', 'fullName', 'password'], this.state);

    this.props.signup(signupData, () => {
      this.props.history.push('/signup/confirm');
    });
  } 

  onChange(e) {
    const { name, value } = e.target;
    this.setState({[name]: value})
  }

  render(){
    return(
      <div>
        <SignupForm 
          {...this.state}
          signupGoogle={this.props.signupGoogle}
          loading={this.props.loading}
          onFormSubmit={this.onFormSubmit}
          onChange={this.onChange }
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.loading
})

export default connect(mapStateToProps, {...authActions, ...errorActions})(Signup);