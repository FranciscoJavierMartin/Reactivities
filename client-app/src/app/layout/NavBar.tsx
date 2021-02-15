import { observer } from 'mobx-react-lite';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import {
  ACTIVITIES_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
} from '../constants/routes';

export default observer(function NavBar() {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} exact to={HOME_PAGE_ROUTE}>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 10 }} />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to={ACTIVITIES_PAGE_ROUTE} />
        <Menu.Item>
          <Button
            as={NavLink}
            to={CREATE_ACTIVITY_PAGE_ROUTE}
            positive
            content='Create Activity'
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
});
