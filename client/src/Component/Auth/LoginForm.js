import React from 'react';

const LoginForm = (props) => {
  return (
    <form className="login-form" onSubmit={(e) => props.onFormSubmit(e)}>
      <input
        type="text"
        className="login-email"
        name="email"
        onChange={(e) => props.onChange(e)}
        value={props.email || ''}
      />
      <input
        type="password"
        className="login-password"
        name="password"
        value={props.password || ''}
        onChange={(e) => props.onChange(e)}
      />
      <button>Log in</button>
    </form>
  )
}

export default LoginForm