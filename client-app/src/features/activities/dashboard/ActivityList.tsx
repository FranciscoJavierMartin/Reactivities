import React, { SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { Link } from 'react-router-dom';
import { getActivityDetailsRoute } from '../../../app/constants/routes';

export default observer(function ActivityList() {
  const [target, setTarget] = useState<string>('');
  const { activityStore } = useStore();
  const { deleteActivity, activitiesByDate, isLoading } = activityStore;

  function handleActivityDelete(
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(event.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity: Activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>
                  {activity.city}, {activity.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  as={Link}
                  to={getActivityDetailsRoute(activity.id)}
                  floated='right'
                  content='View'
                  color='blue'
                />
                <Button
                  name={activity.id}
                  loading={isLoading && target === activity.id}
                  onClick={(e) => handleActivityDelete(e, activity.id)}
                  floated='right'
                  content='Delete'
                  color='red'
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
});
