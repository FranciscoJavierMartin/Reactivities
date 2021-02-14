import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface LoadingComponentProps {
  inverted?: boolean;
  content: string;
}

export default function LoadingComponent({
  inverted = true,
  content = 'Loading...',
}: LoadingComponentProps) {
  return (
    <Dimmer active={true} inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
}
