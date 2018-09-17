import React from 'react'
import { Button, Dropdown, Menu, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

const onLogout = (logout) => {
  logout();
}

const renderIfLogin = ({ auth }) => {
  return auth.isAuthorized
    ? (
      <React.Fragment>
        <Menu.Item name='Dashboard' as={Link} to='/dashboard'/>
        <Menu.Item name='Employees' />
        <Menu.Item name='Settings' />
      </React.Fragment>
    ) : null
}

const renderIfNotLogin = ({ auth, logout }) => {
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
    )
    : (
      <Menu.Item onClick={() => onLogout(logout)} >
        <Button>Log out</Button>
      </Menu.Item>
    )
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