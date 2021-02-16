import React, { SyntheticEvent, useState } from 'react';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getActivityDetailsRoute } from '../../../app/constants/routes';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

interface ActivityListItemProps {
  activity: Activity;
}

export default function ActivityListItem({
  activity,
}: ActivityListItemProps): JSX.Element {
  const [target, setTarget] = useState<string>('');
  const { activityStore } = useStore();
  const { deleteActivity, isLoading } = activityStore;

  function handleActivityDelete(
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(event.currentTarget.name);
    deleteActivity(id);
  }

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={getActivityDetailsRoute(activity.id)}>
                {activity.title}
              </Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {activity.date}
          <Icon name='marker' /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>Attendees go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={getActivityDetailsRoute(activity.id)}
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
}
