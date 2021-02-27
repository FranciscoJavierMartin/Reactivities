import { FastField } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import useQuery from '../../app/common/hooks/useQuery';
import { useStore } from '../../app/stores/store';
import LoginForm from './LoginForm';

export default function ConfirmEmail() {
  const { modalStore } = useStore();
  const email: string = useQuery().get('email')!;
  const token: string = useQuery().get('token')!;

  const Status = {
    Verifying: 'Verifying',
    Failed: 'Failed',
    Success: 'Success',
  };

  const [status, setStatus] = useState(Status.Verifying);

  function handleConfirmEmailResend() {
    agent.Account.resendEmailConfirm(email)
      .then(() => {
        toast.success('Verification email resent - please check your email');
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    agent.Account.verifyEmail(token, email)
      .then(() => {
        setStatus(Status.Success);
      })
      .catch(() => {
        setStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, token, email]);

  function getBody() {
    let res;
    switch (status) {
      case Status.Verifying:
        res = <p>Verifying...</p>;
        break;
      case Status.Success:
        res = (
          <div>
            <p>Email has been verified - you can now login</p>
            <Button
              primary
              onClick={() => modalStore.openModal(<LoginForm />)}
              size='huge'
              content='Login'
            />
          </div>
        );
        break;
      case Status.Failed:
        res = (
          <div>
            <p>
              Verification failed. You can try resending the verify link to your
              email.
            </p>
            <Button
              primary
              onClick={handleConfirmEmailResend}
              content='Resend email'
              size='huge'
            />
          </div>
        );
        break;
    }

    return res;
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon>
        <Icon name='envelope' />
        Email verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
}
