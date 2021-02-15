import React from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivitiDashboard from '../../features/activities/dashboard/ActivitiDashboard';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/homes/HomePage';
import {
  ACTIVITIES_PAGE_ROUTE,
  ACTIVITIES_DETAILS_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  MANAGE_ACTIVITY_PAGE_ROUTE,
} from '../constants/routes';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

export default observer(function App(): JSX.Element {
  const location = useLocation();
  return (
    <>
      <Route exact path={HOME_PAGE_ROUTE} component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Route
                exact
                path={ACTIVITIES_PAGE_ROUTE}
                component={ActivitiDashboard}
              />
              <Route
                path={ACTIVITIES_DETAILS_PAGE_ROUTE}
                component={ActivityDetails}
              />
              <Route
                key={location.key}
                path={[CREATE_ACTIVITY_PAGE_ROUTE, MANAGE_ACTIVITY_PAGE_ROUTE]}
                component={ActivityForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
});
