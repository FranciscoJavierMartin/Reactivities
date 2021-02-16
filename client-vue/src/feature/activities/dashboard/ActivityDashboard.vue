<template>
  <div v-if="!isLoadingInitial" class="ui grid">
    <div class="ten wide column">
      <ActivityList />
    </div>
    <div class="six wide column">
      <h2>Activity Filters</h2>
    </div>
  </div>
  <Loading v-else content="Loading app" />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import ActivityList from './ActivityList.vue';
import Loading from '../../../app/components/Loading.vue';
import { useStore } from '../../../app/store';
import { AllActionTypes } from '../../../app/store/action-types';

export default defineComponent({
  components: {
    ActivityList,
    Loading,
  },
  setup() {
    const store = useStore();
    const isLoadingInitial = computed<boolean>(
      () => store.getters.getIsLoadingInitial
    );

    watch(
      store.getters.getActivitiesByDate,
      () => {
        store.dispatch(AllActionTypes.LOAD_ACTIVITIES);
      },
      {
        immediate: true,
      }
    );

    return {
      isLoadingInitial,
    };
  },
});
</script>