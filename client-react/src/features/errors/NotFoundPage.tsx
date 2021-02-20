import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import { ACTIVITIES_PAGE_ROUTE } from '../../app/constants/routes';

export default function NotFound() {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        Oops - we've looked everywhere and could not find this.
      </Header>
      <Segment.Inline>
        <Button as={Link} to={ACTIVITIES_PAGE_ROUTE} primary>
          Return to activities page
        </Button>
      </Segment.Inline>
    </Segment>
  );
}
