import React, { SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Card, Grid, Header, Tab, TabProps, Image } from 'semantic-ui-react';
import { format } from 'date-fns';
import { useStore } from '../../app/stores/store';
import { UserActivity } from '../../app/models/profile';
import { getActivityDetailsRoute } from '../../app/constants/routes';
import { FilteringPredicate } from '../../app/common/options/filteringOptions';

const panes = [
  { menuItem: 'Future Events', pane: { key: 'future' } },
  { menuItem: 'Past Events', pane: { key: 'past' } },
  { menuItem: 'Hosting', pane: { key: 'hosting' } },
];

export default observer(function ProfileActivities() {
  const { profileStore } = useStore();
  const {
    loadUserActivities,
    profile,
    isLoadingActivities,
    userActivities,
  } = profileStore;

  useEffect(() => {
    loadUserActivities(profile!.username);
  }, [loadUserActivities, profile]);

  const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
    console.log(
      panes[data.activeIndex as number].pane.key as FilteringPredicate
    );
    loadUserActivities(
      profile!.username,
      panes[data.activeIndex as number].pane.key as FilteringPredicate
    );
  };

  return (
    <Tab.Pane loading={isLoadingActivities}>
      <Grid>
        <Grid.Column width='16'>
          <Header floated='left' icon='calendar' content='Activities' />
        </Grid.Column>
        <Grid.Column width='16'>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity: UserActivity) => (
              <Card
                as={Link}
                to={getActivityDetailsRoute(activity.id)}
                key={activity.id}
              >
                <Image
                  src={`/assets/categoryImages/${activity.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{activity.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                    <div>{format(new Date(activity.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
