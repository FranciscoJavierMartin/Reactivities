import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { Button, Reveal } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface FollowButtonProps {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: FollowButtonProps) {
  const { profileStore, userStore } = useStore();
  const { updateFollowing, isLoading } = profileStore;

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    if (profile.following) {
      updateFollowing(username, false);
    } else {
      updateFollowing(username, true);
    }
  }

  return userStore.user?.username === profile.username ? null : (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          color='teal'
          content={profile.following ? 'Following' : 'Not following'}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          fluid
          basic
          color={profile.following ? 'red' : 'green'}
          content={profile.following ? 'Unfollow' : 'Follow'}
          loading={isLoading}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});
