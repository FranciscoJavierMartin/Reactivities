<template>
  <div v-if="!(isLoadingInitial || !activity)" class="ui grid">
    <div class="ui ten wide column">
      <ActivityDetailedHeader :activity="activity" />
      <ActivityDetailedInfo :activity="activity" />
      <ActivityDetailedChat />
    </div>
    <div class="ui six wide column">
      <ActivityDetailedSidebar />
    </div>
  </div>
  <Loading v-else content="Loading activity" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import ActivityDetailedHeader from './ActivityDetailedHeader.vue';
import ActivityDetailedInfo from './ActivityDetailedInfo.vue';
import ActivityDetailedChat from './ActivityDetailedChat.vue';
import ActivityDetailedSidebar from './ActivityDetailedSidebar.vue';
import Loading from '../../../app/components/Loading.vue';
import { useStore } from '../../../app/store';
import { AllActionTypes } from '../../../app/store/action-types';
import { Activity } from '../../../app/models/activity';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: {
    Loading,
    ActivityDetailedHeader,
    ActivityDetailedInfo,
    ActivityDetailedChat,
    ActivityDetailedSidebar,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    onMounted(() => {
      store.dispatch(AllActionTypes.LOAD_ACTIVITY, route.params.id.toString());
    });

    const activity = computed<Activity | undefined>(() => {
      return store.getters.getSelectedActivity;
    });
    const isLoadingInitial = computed<boolean>(
      () => store.getters.getIsLoadingInitial
    );

    return {
      activity,
      isLoadingInitial,
    };
  },
});
</script>
