import { combineReducers } from 'redux';
import auth_reducers from '../Component/Auth/auth_reducers';
import loading_reducer from '../Reducers/loading_reducer';
import error_reducer from '../Reducers/error_reducer';
import message_reducer from '../Reducers/message_reducer';
import tenant_reducers from '../Component/TenantDashboard/tenant_reducers';

export default combineReducers({
  auth: auth_reducers,
  tenant: tenant_reducers,
  loading: loading_reducer,
  error: error_reducer,
  message: message_reducer
})