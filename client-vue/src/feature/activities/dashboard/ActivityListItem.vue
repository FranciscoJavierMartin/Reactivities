<template>
  <div class="ui segments">
    <div class="ui segement host">
      <div class="ui items">
        <div class="item">
          <div class="ui tiny circular image">
            <img src="/assets/user.png" />
          </div>
          <div class="content">
            <router-link class="header" :to="`/activities/${activity.id}`">
              {{ activity.title }}
            </router-link>
            <div class="description">Hosted by Bob</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui segment">
      <span>
        <i class="clock icon" /> {{ activity.date }} <i class="marker icon" />
        {{ activity.venue }}
      </span>
    </div>
    <div class="ui secondary segment">Attendees go here</div>
    <div class="ui clearing segment">
      <span>{{ activity.description }}</span>
      <router-link
        :to="`/activities/${activity.id}`"
        class="ui teal right floated button"
        role="button"
      >
        View
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store';

export default defineComponent({
  props: {
    activity: {
      type: Object as () => Activity,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const isLoading = computed<boolean>(() => store.getters.getIsLoading);

    return {
      isLoading,
    };
  },
});
</script>

<style scoped>
.host {
  padding: 15px;
  background-color: #ffffff;
}
</style>
