import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import { getProfileRoute } from '../../../app/constants/routes';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface ActivityListItemAttendeeProps {
  attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({
  attendees,
}: ActivityListItemAttendeeProps): JSX.Element {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <Popup
          hoverable
          key={attendee.username}
          trigger={
            <List.Item
              key={attendee.username}
              as={Link}
              to={getProfileRoute(attendee.username)}
            >
              <Image
                size='mini'
                circular
                src={attendee.image || '/assets/user.png'}
                alt={attendee.username}
              />
            </List.Item>
          }
        >
          <Popup.Content>
            <ProfileCard profile={attendee} />
          </Popup.Content>
        </Popup>
      ))}
    </List>
  );
});
