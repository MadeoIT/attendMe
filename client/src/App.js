import React, { Component } from 'react';
import { Switch, Route, Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

//Routes
import Todos from './Component/Todo/Todos';
import Signup from './Component/Auth/Signup';
import Login from './Component/Auth/Login';
import PrivateRoute from './Utils/PrivateRoute';
import Navbar from './Component/Navbar/Navbar';
import FlashMessages from './Component/FlashMessages/FlashMessages';

export class App extends Component {
  render() {
    return (
      <div>
        <Navbar auth={this.props.auth} />
        <FlashMessages />
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/signup' component={Signup} />
          <PrivateRoute path='/todos' component={Todos} auth={this.props.auth} />
          <Route exact path='/' component={Login} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export const AppConnected = connect(mapStateToProps)(App);

export default withRouter(AppConnected);
