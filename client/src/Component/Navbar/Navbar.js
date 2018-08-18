import React from 'react'
import { Button, Dropdown, Menu, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

const renderIfLogin = ({ auth }) => {
  return auth.isAuthorized
    ? (
      <React.Fragment>
        <Menu.Item name='home' />
        <Menu.Item name='my todos' />
      </React.Fragment>
    ) : null
}

const renderIfNotLogin = ({ auth }) => {
  return !auth.isAuthorized
    ? (
      <React.Fragment>
        <Menu.Item as={Link} to='/signup' >
          <Button primary>Sign Up</Button>
        </Menu.Item>

        <Menu.Item as={Link} to='/login' >
          <Button>Log in</Button>
        </Menu.Item>
      </React.Fragment>
    ) : null
}

const Navbar = (props) => {
  return (
    <Menu size='small'>
      <Container>

        {renderIfLogin(props)}

        <Menu.Menu position='right'>
          <Dropdown item text='Language'>
            <Dropdown.Menu>
              <Dropdown.Item>English</Dropdown.Item>
              <Dropdown.Item>Russian</Dropdown.Item>
              <Dropdown.Item>Spanish</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {renderIfNotLogin(props)}

        </Menu.Menu>
      </Container>
    </Menu>
  )
}

export default Navbar;