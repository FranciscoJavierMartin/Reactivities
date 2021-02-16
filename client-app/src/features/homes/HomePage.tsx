import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { ACTIVITIES_PAGE_ROUTE } from '../../app/constants/routes';

export default function HomePage(): JSX.Element {
  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        <Header as='h2' inverted content='Welcome to Reactivities' />
        <Button as={Link} to={ACTIVITIES_PAGE_ROUTE} size='huge' inverted>
          Take me to the Activities!
        </Button>
      </Container>
    </Segment>
  );
}
