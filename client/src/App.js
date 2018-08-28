import React, { Component } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authActions from './Component/Auth/auth_actions';

//Routes
import Todos from './Component/Todo/Todos';
import Signup from './Component/Auth/Signup';
import Login from './Component/Auth/Login';
import PrivateRoute from './Utils/PrivateRoute';
import Navbar from './Component/Navbar/Navbar';
import FlashMessages from './Component/FlashMessages/FlashMessages';
import ConfirmEmail from './Component/Auth/ConfirmEmail';
import AfterSignup from './Component/Auth/AfterSignup';
import GoogleAuth from './Component/Auth/GoogleAuth';
import ResetPassword from './Component/Auth/ResetPassword';

export class App extends Component {
  render() {
    return (
      <div>
        <Navbar auth={this.props.auth} logout={this.props.logout}/>
        <FlashMessages />

        <Switch>
          <Route path='/google/welcome/:tokenId' component={GoogleAuth} />
          <Route path='/signup/confirm/:tokenId' component={ConfirmEmail} />
          <Route path='/login/password/:tokenId' component={ResetPassword} />
          <Route path='/signup/confirm/' component={AfterSignup} />
          <PrivateRoute path='/todos' component={Todos} auth={this.props.auth} />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <Route exact path='/' component={Login} />
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
