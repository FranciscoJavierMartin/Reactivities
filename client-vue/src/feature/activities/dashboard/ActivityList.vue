<template>
  <div>
    <div v-for="[group, activities] in groupedActivities" :key="group" class="group-by-date">
      <div class="ui teal sub header">
        {{ group }}
      </div>
      <div>
      <ActivityListItem
        :activity="activity"
        v-for="activity in activities"
        :key="activity.id"
      />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store';
import ActivityListItem from './ActivityListItem.vue';

export default defineComponent({
  components: {
    ActivityListItem,
  },
  setup() {
    const store = useStore();

    const groupedActivities = computed<[string, Activity[]][]>(
      () => store.getters.getGroupedActivities
    );

    return {
      groupedActivities,
    };
  },
});
</script>

<style scoped>
.group-by-date{
  padding-bottom: 20px;
}

.ui.teal.sub.header{
  padding-bottom: 15px;
}
</style>
