<template>
  <div class="ui segments">
    <div class="ui segement host">
      <div class="ui items">
        <div class="item">
          <div class="ui tiny circular image">
            <img src="/assets/user.png" />
          </div>
          <div class="content">
            <router-link
              class="header"
              :to="{
                name: ACTIVITY_DETAILS_PAGE_NAME,
                params: { id: activity.id },
              }"
            >
              {{ activity.title }}
            </router-link>
            <div class="description">Hosted by Bob</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui segment">
      <span>
        <i class="clock icon" />
        {{ dateFormatted }}
        <i class="marker icon" />
        {{ activity.venue }}
      </span>
    </div>
    <div class="ui secondary segment">Attendees go here</div>
    <div class="ui clearing segment">
      <span>{{ activity.description }}</span>
      <router-link
        :to="{ name: ACTIVITY_DETAILS_PAGE_NAME, params: { id: activity.id } }"
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
import { format } from 'date-fns';
import { ACTIVITY_DETAILS_PAGE_NAME } from '../../../app/constants/routes';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store';

export default defineComponent({
  props: {
    activity: {
      type: Object as () => Activity,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const isLoading = computed<boolean>(() => store.getters.getIsLoading);
    const dateFormatted = computed<string>(() =>
      format(props.activity.date!, 'dd MMM yyyy h:mm aa')
    );

    return {
      isLoading,
      dateFormatted,
      ACTIVITY_DETAILS_PAGE_NAME,
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
