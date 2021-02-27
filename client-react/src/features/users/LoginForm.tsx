import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Button, Header, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import CustomTextInput from '../../app/common/form/CustomTextInput';
import { useStore } from '../../app/stores/store';

export default observer(function LoginForm(): JSX.Element {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{ email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.login(values).catch((error) =>
          setErrors({
            error: error.response.data,
          })
        )
      }
      validationSchema={Yup.object({
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <Header
            as='h2'
            content='Login to Reactivities'
            color='teal'
            textAlign='center'
          />
          <CustomTextInput name='email' placeholder='Email' />
          <CustomTextInput
            name='password'
            placeholder='Password'
            type='password'
          />
          <ErrorMessage
            name='error'
            render={() => (
              <Label
                style={{ marginBottom: 10 }}
                basic
                color='red'
                content={errors.error}
              />
            )}
          />
          <Button
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
            positive
            content='Login'
            type='submit'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
});
