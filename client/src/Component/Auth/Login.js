import React from 'react';
import { connect } from 'react-redux';
import * as actions from './auth_actions';
import LoginForm from './LoginForm';
import EmailBox from './EmailBox';
import { getGeolocation } from '../../Utils';

export class Login extends React.Component {
  constructor(...args) {
    super(...args);

    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.state = {
      isModalOpen: false
    }
  }

  //async componentDidMount() {
  //  try {
  //    const geolocation = await getGeolocation();
  //    localStorage.setItem('geolocation', geolocation);
  //  } catch (error) {
  //    console.log(error);
  //  }
  //}

  onChange(e){
    const { value, name } = e.target;
    this.setState({[name]: value});
  }

  onFormSubmit(e){
    e.preventDefault();
    
    this.props.login(this.state, () => {
      this.props.history.push(`/todos`);
    });
  }

  onSubmitEmail(){
    this.props.sendResetPasswordEmail(this.state.resetEmail);
    this.toggle();
  }

  toggle(){
    this.setState({isModalOpen: !this.state.isModalOpen})
  }

  render(){
    return(
      <div>
        <LoginForm 
          onChange={this.onChange}
          onFormSubmit={this.onFormSubmit}
          {...this.state}
          loading={this.props.loading}
          toggle={this.toggle}
        />
        <EmailBox 
          isModalOpen={this.state.isModalOpen} 
          toggle={this.toggle}
          onChange={this.onChange}
          resetEmail={this.state.resetEmail}
          onSubmitEmail={this.onSubmitEmail}
          loading={this.props.loading}
        />
      </div>
    )
  }
};

const mapStateToProps = state => ({
  auth: state.auth,
  loading: state.loading
})

export default connect(mapStateToProps, actions)(Login);