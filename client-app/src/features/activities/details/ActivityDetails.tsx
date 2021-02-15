import { observer } from 'mobx-react-lite';
import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

interface ActivityDetailsProps {}

export default observer(function ActivityDetails({}: ActivityDetailsProps) {
  const { activityStore } = useStore();
  const { selectedActivity, openForm, cancelSelectedActivity } = activityStore;
  return selectedActivity ? (
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
            onClick={() => openForm(selectedActivity.id)}
            basic
            color='blue'
            content='Edit'
          />
          <Button
            onClick={cancelSelectedActivity}
            basic
            color='grey'
            content='Cancel'
          />
        </Button.Group>
      </Card.Content>
    </Card>
  ) : null;
});
