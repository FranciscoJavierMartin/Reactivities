import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const {
    selectedActivity,
    loadActivity,
    isLoadingInitial,
    clearSelectedActivity,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }

    return () => {
      clearSelectedActivity();
    };
  }, [id, loadActivity, clearSelectedActivity]);

  return isLoadingInitial || !selectedActivity ? (
    <LoadingComponent content='Loading activity' />
  ) : (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={selectedActivity} />
        <ActivityDetailedInfo activity={selectedActivity} />
        <ActivityDetailedChat activityId={selectedActivity.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar activity={selectedActivity} />
      </Grid.Column>
    </Grid>
  );
});
