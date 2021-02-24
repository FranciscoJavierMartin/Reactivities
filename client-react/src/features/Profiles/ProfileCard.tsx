import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { getProfileRoute } from '../../app/constants/routes';
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface ProfileCardProps {
  profile: Profile;
}

function truncate(str: string | undefined): string | undefined {
  if (str) {
    return str.length > 40 ? str.substring(0, 37) + '...' : str;
  }
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card as={Link} to={getProfileRoute(profile.username)}>
      <Image src={profile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{profile.displayName}</Card.Header>
        <Card.Description>{truncate(profile.bio)}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
        {profile.followersCount}{' '}
        {profile.followersCount !== 1 ? 'Followers' : 'Follower'}
      </Card.Content>
      <FollowButton profile={profile} />
    </Card>
  );
}
