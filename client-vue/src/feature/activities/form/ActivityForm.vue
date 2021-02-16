<template>
  <div v-if="!(id && isLoadingInitial)" class="ui clearing segment">
    <form @submit.prevent="submit" autocomplete="off" class="ui form">
      <FormInput placeholder="Title" name="title" v-model="activity.title" />
      <FormInput
        placeholder="Description"
        name="description"
        v-model="activity.description"
      />
      <FormInput
        placeholder="Category"
        name="category"
        v-model="activity.category"
      />
      <FormInput
        placeholder="Date"
        :inputType="date"
        name="date"
        v-model="activity.date"
      />
      <FormInput placeholder="City" name="city" v-model="activity.city" />
      <FormInput placeholder="Venue" name="venue" v-model="activity.venue" />

      <button type="submit" class="ui positive right floated button">
        Submit
      </button>
      <router-link to="/activities" class="ui right floated button">
        Cancel
      </router-link>
    </form>
  </div>
  <Loading v-else content="Loading activity" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuid } from "uuid";
import Loading from "../../../app/components/Loading.vue";
import FormInput from "../../../app/components/FormInput.vue";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store";
import { AllActionTypes } from "../../../app/store/action-types";

export default defineComponent({
  components: {
    Loading,
    FormInput,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const { id } = route.params;
    const isLoadingInitial = computed<boolean>(
      () => store.getters.getIsLoadingInitial
    );
    let activity = reactive<Activity>({
      id: "",
      title: "",
      category: "",
      description: "",
      date: "",
      city: "",
      venue: "",
    });

    const submit = () => {
      console.log(activity.title);
      if (activity.id) {
        store.dispatch(AllActionTypes.UPDATE_ACTIVITY, activity).then(() => {
          router.push({ name: "ActivityDetails", params: { id: activity.id } });
        });
      } else {
        let newActivity = {
          ...activity,
          id: uuid(),
        };
        store.dispatch(AllActionTypes.CREATE_ACTIVITY, newActivity).then(() => {
          router.push({
            name: "ActivityDetails",
            params: { id: newActivity.id },
          });
        });
      }
    };

    onMounted(() => {
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
      }
    });

    const handleChange = (value1: { value: string; name: string }): void => {
      const { value, name } = value1;
      console.log({ value, name });
      (activity as any)[name] = value;
    };

    return {
      activity,
      isLoadingInitial,
      id,
      submit,
      handleChange,
    };
  },
});
</script>