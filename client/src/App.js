import React, { Component } from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authActions from './Component/Auth/auth_actions';

//Routes
import Signup from './Component/Auth/Signup';
import Login from './Component/Auth/Login';
import PrivateRoute from './Utils/PrivateRoute';
import Navbar from './Component/Navbar/Navbar';
import FlashMessages from './Component/FlashMessages/FlashMessages';
import ConfirmEmail from './Component/Auth/ConfirmEmail';
import AfterSignup from './Component/Auth/AfterSignup';
import GoogleAuth from './Component/Auth/GoogleAuth';
import ResetPassword from './Component/Auth/ResetPassword';
import TenantDashboard from './Component/TenantDashboard/TenantDashboard';
import Employee from './Component/Employee/Employee';

export class App extends Component {
  render() {

    const renderFirstPage = ({isAuthorized, id}) => (
      isAuthorized 
        ? <Redirect to={`/dashboard/${id}`} />
        : <Redirect to='/login' /> 
    );

    return (
      <div>
        <Navbar auth={this.props.auth} logout={this.props.logout}/>
        <FlashMessages />

        <Switch>
          <Route path='/google/welcome/:tokenId' component={GoogleAuth} />
          <Route path='/signup/confirm/:tokenId' component={ConfirmEmail} />
          <Route path='/login/password/:tokenId' component={ResetPassword} />
          <Route path='/signup/confirm/' component={AfterSignup} />

          <PrivateRoute path='/dashboard/:tenantId' component={TenantDashboard} auth={this.props.auth} />
          <PrivateRoute path='/dashboard/:tenandId/employee' component={Employee} />
          
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          {renderFirstPage(this.props.auth)}
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export const AppConnected = connect(mapStateToProps, authActions)(App);

export default withRouter(AppConnected);
