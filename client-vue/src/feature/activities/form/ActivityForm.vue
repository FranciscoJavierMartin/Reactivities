<template>
  <div v-if="!(id && isLoadingInitial)" class="ui clearing segment">
    <div class="ui teal sub header">Activity Details</div>
    <Form
      @submit="onSubmit"
      autocomplete="off"
      class="ui form"
      :validation-schema="schema"
      v-slot="{ errors }"
      :initialValues="activity"
    >
      <div class="field" :class="{ error: errors.title }">
        <Field
          type="text"
          placeholder="Title"
          name="title"
          :class="{ error: errors.title }"
        />
        <div class="ui red basic label" v-if="errors.title">
          {{ errors.title }}
        </div>
      </div>
      <div class="field" :class="{ error: errors.description }">
        <Field
          type="text"
          placeholder="Description"
          name="description"
          :class="{ error: errors.description }"
        />
        <div class="ui red basic label" v-if="errors.description">
          {{ errors.description }}
        </div>
      </div>
      <div class="field" :class="{ error: errors.category }">
        <Field
          as="select"
          placeholder="Category"
          name="category"
          :class="{ error: errors.category }"
        >
          <option
            v-for="categoryOption in categoryOptions"
            :value="categoryOption.value"
            :key="categoryOption.value"
            :selected="categoryOption.value === activity.category"
          >
            {{ categoryOption.text }}
          </option>
        </Field>
        <div class="ui red basic label" v-if="errors.category">
          {{ errors.category }}
        </div>
      </div>
      <div class="field" :class="{ error: errors.date }">
        <Field
          type="date"
          placeholder="Date"
          name="date"
          :class="{ error: errors.date }"
        />
        <div class="ui red basic label" v-if="errors.date">
          {{ errors.date }}
        </div>
      </div>
      <div class="ui teal sub header">Location Details</div>
      <div class="field" :class="{ error: errors.city }">
        <Field
          type="text"
          placeholder="City"
          name="city"
          :class="{ error: errors.city }"
        />
        <div class="ui red basic label" v-if="errors.city">
          {{ errors.city }}
        </div>
      </div>
      <div class="field" :class="{ error: errors.venue }">
        <Field
          type="text"
          placeholder="Venue"
          name="venue"
          :class="{ error: errors.venue }"
        />
        <div class="ui red basic label" v-if="errors.venue">
          {{ errors.venue }}
        </div>
      </div>
      <button
        type="submit"
        class="ui positive right floated button"
        :class="{ loading: isLoading }"
      >
        Submit
      </button>
      <router-link
        :to="{ name: ACTIVITY_DASHBOARD_PAGE_NAME }"
        class="ui right floated button"
      >
        Cancel
      </router-link>
    </Form>
  </div>
  <Loading v-else content="Loading activity" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuid } from 'uuid';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import Loading from '../../../app/components/Loading.vue';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store';
import { AllActionTypes } from '../../../app/store/action-types';
import { categoryOptions } from '../../../app/constants/categoryOptions';
import {
  ACTIVITY_DETAILS_PAGE_NAME,
  ACTIVITY_DASHBOARD_PAGE_NAME,
} from '../../../app/constants/routes';

export default defineComponent({
  components: {
    Loading,
    Form,
    Field,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { id } = route.params;
    const isLoadingInitial = computed<boolean>(
      () => store.getters.getIsLoadingInitial
    );
    const isLoading = computed<boolean>(() => store.getters.getIsLoading);
    let activity: Activity = reactive<Activity>({
      id: '',
      title: '',
      category: '',
      description: '',
      date: null,
      city: '',
      venue: '',
    });

    watch(
      () => route.params.id,
      (id) => {
        if (id) {
          store
            .dispatch(AllActionTypes.LOAD_ACTIVITY, id.toString())
            .then((a) => {
              if (a) {
                activity.title = a.title;
                activity.id = a.id;
                activity.description = a.description;
                activity.category = a.category;
                activity.date = a.date;
                activity.city = a.city;
                activity.venue = a.venue;
              }
            });
        } else {
          activity.title = '';
          activity.id = '';
          activity.description = '';
          activity.category = '';
          activity.date = null;
          activity.city = '';
          activity.venue = '';
        }
      },
      {
        immediate: true,
      }
    );

    const schema = Yup.object().shape({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string().required('Category is required'),
      date: Yup.string().required('Date is required'),
      city: Yup.string().required('City is required'),
      venue: Yup.string().required('Venue is required'),
    });

    const onSubmit = (values: Activity) => {
      if (values.id) {
        store.dispatch(AllActionTypes.UPDATE_ACTIVITY, values).then(() => {
          router.push({
            name: ACTIVITY_DETAILS_PAGE_NAME,
            params: { id: values.id },
          });
        });
      } else {
        let newActivity = {
          ...values,
          id: uuid(),
        };
        store.dispatch(AllActionTypes.CREATE_ACTIVITY, newActivity).then(() => {
          router.push({
            name: ACTIVITY_DETAILS_PAGE_NAME,
            params: { id: newActivity.id },
          });
        });
      }
    };

    return {
      activity,
      isLoading,
      isLoadingInitial,
      id,
      onSubmit,
      schema,
      categoryOptions,
      ACTIVITY_DASHBOARD_PAGE_NAME,
    };
  },
});
</script>