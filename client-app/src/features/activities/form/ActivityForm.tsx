import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import {
  ACTIVITIES_PAGE_ROUTE,
  getActivityDetailsRoute,
} from '../../../app/constants/routes';
import CustomTextInput from '../../../app/common/form/CustomTextInput';
import CustomTextArea from '../../../app/common/form/CustomTextArea';
import CustomSelectInput from '../../../app/common/form/CustomSelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import CustomDateInput from '../../../app/common/form/CustomDateInput';

export default observer(function ActivityForm() {
  const history = useHistory();
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    isLoading,
    loadActivity,
    isLoadingInitial,
  } = activityStore;
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: '',
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    date: Yup.string().required('Date is required'),
    city: Yup.string().required('City is required'),
    venue: Yup.string().required('Venue is required'),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity: Activity | undefined) => {
        setActivity(activity!);
      });
    }
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (activity.id) {
      updateActivity(activity).then(() => {
        history.push(getActivityDetailsRoute(activity.id));
      });
    } else {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() => {
        history.push(getActivityDetailsRoute(newActivity.id));
      });
    }
  }

  return id && isLoadingInitial ? (
    <LoadingComponent content='Loading activity' />
  ) : (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <CustomTextInput placeholder='Title' name='title' />
            <CustomTextArea
              rows={3}
              placeholder='Description'
              name='description'
            />
            <CustomSelectInput
              options={categoryOptions}
              placeholder='Category'
              name='category'
            />
            <CustomDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <Header content='Location Details' sub color='teal' />
            <CustomTextInput placeholder='City' name='city' />
            <CustomTextInput placeholder='Venue' name='venue' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isLoading}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button
              as={Link}
              to={ACTIVITIES_PAGE_ROUTE}
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
