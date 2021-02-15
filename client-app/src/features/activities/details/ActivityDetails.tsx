import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Image, Button } from 'semantic-ui-react';
import { getManageActivityRoute } from '../../../app/constants/routes';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityDetails() {
  const { activityStore } = useStore();
  const { selectedActivity, loadActivity, isLoadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadActivity(id);
    }
  }, [id, loadActivity]);

  return isLoadingInitial || !selectedActivity ? null : (
    <Card fluid>
      <Image src={`/assets/categoryImages/${selectedActivity.category}.jpg`} />
      <Card.Content>
        <Card.Header>{selectedActivity.title}</Card.Header>
        <Card.Meta>
          <span className='date'>{selectedActivity.date}</span>
        </Card.Meta>
        <Card.Description>{selectedActivity.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
          <Button
            as={Link}
            to={getManageActivityRoute(selectedActivity.id)}
            basic
            color='blue'
            content='Edit'
          />
          <Button basic color='grey' content='Cancel' />
        </Button.Group>
      </Card.Content>
    </Card>
  );
});
