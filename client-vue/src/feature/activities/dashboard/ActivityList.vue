<template>
  <div class="ui segment">
    <div class="ui divided items">
      <div class="item" v-for="activity in activities" :key="activity.id">
        <div class="content">
          <router-link class="header" :to="`/activities/${activity.id}`">
            {{ activity.title }}
          </router-link>
          <div class="meta">
            {{ activity.date }}
          </div>
          <div class="description">
            {{ activity.description }}
          </div>
          <div class="extra">
            <router-link
              :disabled="isLoading && target === activity.id"
              :to="`/activities/${activity.id}`"
              class="ui blue right floated button"
              role="button"
              >View</router-link
            >
            <button
              :name="activity.id"
              :disabled="isLoading && target === activity.id"
              :class="{ loading: isLoading && target === activity.id }"
              @click="handleDelete(activity.id)"
              class="ui red right floated button"
            >
              Delete
            </button>
            <div class="ui basic label">
              {{ activity.category }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store";
import { AllActionTypes } from "../../../app/store/action-types";

export default defineComponent({
  setup() {
    const store = useStore();
    const target = ref<string>("");

    const activities = computed<Activity[]>(
      () => store.getters.getActivitiesByDate
    );
    const isLoading = computed<boolean>(() => store.getters.getIsLoading);

    const handleDelete = (id: string): void => {
      target.value = id;
      store.dispatch(AllActionTypes.DELETE_ACTIVITY, id);
    };

    return {
      activities,
      handleDelete,
      target,
      isLoading,
    };
  },
});
</script>