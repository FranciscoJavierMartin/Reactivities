import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { profileStore } = useStore();
  const { isLoadingProfile, loadProfile, profile, setActiveTab } = profileStore;

  useEffect(() => {
    loadProfile(username);

    return () => {
      setActiveTab(0);
    };
  }, [loadProfile, username, setActiveTab]);

  return isLoadingProfile ? (
    <LoadingComponent content='Loading profile...' />
  ) : (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
