import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivitiDashboard from '../../features/activities/dashboard/ActivitiDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

export default function App(): JSX.Element {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: Activity[] = response.map((activity: Activity) => ({
        ...activity,
        date: activity.date.split('T')[0],
      }));
      setActivities(activities);
      setIsLoading(false);
    });
  }, []);

  function handleSelectedActivity(id: string) {
    setSelectedActivity(
      activities.find((activity: Activity) => activity.id === id)
    );
  }

  function handleCancelSelectedActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    if (id) {
      handleSelectedActivity(id);
    } else {
      handleCancelSelectedActivity();
    }

    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateorEditActivity(activity: Activity) {
    setSubmitting(true);

    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((x) => x.id !== activity.id),
          activity,
        ]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }
  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
      setSubmitting(false);
    });
  }

  return isLoading ? (
    <LoadingComponent content='Loading App ...' />
  ) : (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivitiDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelSelectedActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateorEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  );
}
