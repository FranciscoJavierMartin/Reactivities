<template>
  <div v-if="!isLoadingInitial" class="ui grid">
    <div class="ten wide column">
      <ActivityList />
    </div>
    <div class="six wide column">
      <ActivityFilters/>
    </div>
  </div>
  <Loading v-else content="Loading app" />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import ActivityList from './ActivityList.vue';
import ActivityFilters from './ActivityFilters.vue';
import Loading from '../../../app/components/Loading.vue';
import { useStore } from '../../../app/store';
import { AllActionTypes } from '../../../app/store/action-types';

export default defineComponent({
  components: {
    ActivityList,
    ActivityFilters,
    Loading,
  },
  setup() {
    const store = useStore();
    const isLoadingInitial = computed<boolean>(
      () => store.getters.getIsLoadingInitial
    );

    watch(
      store.getters.getGroupedActivities,
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