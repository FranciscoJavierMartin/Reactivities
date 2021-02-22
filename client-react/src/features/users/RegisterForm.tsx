import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import CustomTextInput from '../../app/common/form/CustomTextInput';
import { useStore } from '../../app/stores/store';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function RegisterForm(): JSX.Element {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{
        displayName: '',
        username: '',
        email: '',
        password: '',
        error: null,
      }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) =>
          setErrors({
            error,
          })
        )
      }
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
          <Header
            as='h2'
            content='Sign up to Reactivities'
            color='teal'
            textAlign='center'
          />
          <CustomTextInput name='displayName' placeholder='Display Name' />
          <CustomTextInput name='username' placeholder='Username' />
          <CustomTextInput name='email' placeholder='Email' />
          <CustomTextInput
            name='password'
            placeholder='Password'
            type='password'
          />
          <ErrorMessage
            name='error'
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
            positive
            content='Register'
            type='submit'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
