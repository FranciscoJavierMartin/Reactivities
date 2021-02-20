import React from 'react';
import { Item, Button, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getActivityDetailsRoute } from '../../../app/constants/routes';
import { Activity } from '../../../app/models/activity';

interface ActivityListItemProps {
  activity: Activity;
}

export default function ActivityListItem({
  activity,
}: ActivityListItemProps): JSX.Element {
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
          <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
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
