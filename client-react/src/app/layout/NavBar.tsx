import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import {
  ACTIVITIES_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_ROUTE,
  ERRORS_PAGE_ROUTE,
  getProfileRoute,
  HOME_PAGE_ROUTE,
} from '../constants/routes';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
  const {
    userStore: { logout, user, isLoggedIn },
  } = useStore();
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} exact to={HOME_PAGE_ROUTE}>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        {isLoggedIn && (
          <>
            <Menu.Item
              name='Activities'
              as={NavLink}
              to={ACTIVITIES_PAGE_ROUTE}
            />
            {process.env.NODE_ENV === 'development' && (
              <Menu.Item name='Errors' as={NavLink} to={ERRORS_PAGE_ROUTE} />
            )}
            <Menu.Item>
              <Button
                as={NavLink}
                to={CREATE_ACTIVITY_PAGE_ROUTE}
                positive
                content='Create Activity'
              />
            </Menu.Item>
            <Menu.Item position='right'>
              <Image
                src={user?.image || '/assets/user.png'}
                avatar
                spaced='right'
              />
              <Dropdown pointing='top left' text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={getProfileRoute(user?.username)}
                    text='My Profile'
                    icon='user'
                  />
                  <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
});
