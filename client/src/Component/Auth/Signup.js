import React from 'react';
import SignupForm from './SignupForm';
import * as actions from './auth_actions';
import { connect } from 'react-redux';

export class Signup extends React.Component{
  constructor(...args) {
    super(...args);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    
    this.state = {}
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.props.signup(this.state);
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

export default connect(mapStateToProps, actions)(Signup);