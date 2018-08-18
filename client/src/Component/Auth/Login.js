import React from 'react';
import { connect } from 'react-redux';
import * as actions from './auth_actions';
import LoginForm from './LoginForm';

export class Login extends React.Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.state = {}
  }

  onChange(e){
    const { value, name } = e.target;
    this.setState({[name]: value});
  }

  onFormSubmit(e){
    e.preventDefault();
    this.props.login(this.state);
  }

  render(){
    return(
      <div>
        <LoginForm 
          onChange={this.onChange}
          onFormSubmit={this.onFormSubmit}
          {...this.state}
        />
      </div>
    )
  }
};

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, actions)(Login);