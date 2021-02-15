import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { ACTIVITIES_PAGE_ROUTE } from '../../app/constants/routes';

export default function HomePage(): JSX.Element {
  return (
    <Container style={{ marginTop: '7em' }}>
      <h1>Home Page</h1>
      <h3>
        Go to <Link to={ACTIVITIES_PAGE_ROUTE}>Activities</Link>
      </h3>
    </Container>
  );
}
