<template>
  <div v-if="!(isLoadingInitial || !activity)" class="ui fluid card">
    <img :src="`../../../assets/categoryImages/${activity.category}.jpg`" />
    <div class="content">
      <div class="header">
        {{ activity.title }}
      </div>
      <div class="meta">
        <span class="date">{{ activity.date }}</span>
      </div>
      <div class="description">
        {{ activity.description }}
      </div>
    </div>
    <div class="extra content">
      <div class="ui two buttons">
        <router-link
          :to="`/manage/${activity.id}`"
          class="ui blue basic button"
        >
          Edit
        </router-link>
        <button class="ui grey basic button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '../../../app/store';
import { AllActionTypes } from '../../../app/store/action-types';
import { Activity } from '../../../app/models/activity';
import { useRoute } from 'vue-router';

export default defineComponent({
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
