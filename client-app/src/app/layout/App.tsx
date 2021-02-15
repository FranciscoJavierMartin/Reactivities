import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivitiDashboard from '../../features/activities/dashboard/ActivitiDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';

export default observer(function App(): JSX.Element {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  return activityStore.isLoadingInitial ? (
    <LoadingComponent content='Loading App ...' />
  ) : (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiDashboard />
      </Container>
    </>
  );
});
