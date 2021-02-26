import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/homes/HomePage';
import {
  ACTIVITIES_PAGE_ROUTE,
  ACTIVITIES_DETAILS_PAGE_ROUTE,
  CREATE_ACTIVITY_PAGE_ROUTE,
  HOME_PAGE_ROUTE,
  MANAGE_ACTIVITY_PAGE_ROUTE,
  ERRORS_PAGE_ROUTE,
  SERVER_ERROR_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
} from '../constants/routes';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import NotFoundPage from '../../features/errors/NotFoundPage';
import ServerErrorPage from '../../features/errors/ServerErrorPage';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

export default observer(function App(): JSX.Element {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      userStore.getFacebookLoginStatus().then(() => commonStore.setAppLoaded());
    }
  }, [commonStore, userStore]);

  return !commonStore.appLoaded ? (
    <LoadingComponent content='Loading app' />
  ) : (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path={HOME_PAGE_ROUTE} component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute
                  exact
                  path={ACTIVITIES_PAGE_ROUTE}
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path={ACTIVITIES_DETAILS_PAGE_ROUTE}
                  component={ActivityDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={[
                    CREATE_ACTIVITY_PAGE_ROUTE,
                    MANAGE_ACTIVITY_PAGE_ROUTE,
                  ]}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path={PROFILE_PAGE_ROUTE}
                  component={ProfilePage}
                />
                {process.env.NODE_ENV === 'development' && (
                  <Route path={ERRORS_PAGE_ROUTE} component={TestErrors} />
                )}
                <Route
                  path={SERVER_ERROR_PAGE_ROUTE}
                  component={ServerErrorPage}
                />
                <Route component={NotFoundPage} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
});
