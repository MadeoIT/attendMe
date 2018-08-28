import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

const renderGoogleButton = (loading) => (
  <Button color='google plus' fluid size='large' disabled={loading > 0 ? true : false}>
    <Icon name='google plus' /> Google Plus
  </Button>
)

const GoogleButton = ({loading}) => {
  return loading > 0
    ? renderGoogleButton(loading)
    : <a href="/auth/google">{renderGoogleButton(loading)}</a >
};

export default GoogleButton;
