<template>
  <div class="ui segments">
    <div class="ui top attached segment">
      <div class="ui grid">
        <div class="one wide column">
          <i class="teal info large icon" />
        </div>
        <div class="fifteen wide column">
          <p>{{ activity.description }}</p>
        </div>
      </div>
    </div>
    <div class="ui attached segment">
      <div class="ui middle aligned grid">
        <div class="one wide column">
          <i class="calendar large icon teal" />
        </div>
        <div class="fifteen wide column">
          <span>{{ dateFormatted }}</span>
        </div>
      </div>
    </div>
    <div class="ui attached segment">
      <div class="ui middle aligned grid">
        <div class="one wide column">
          <i class="marker large teal icon" />
        </div>
        <div class="eleven wide column">
          <span> {{ activity.venue }}, {{ activity.city }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { format } from 'date-fns';
import { computed, defineComponent } from 'vue';
import { Activity } from '../../../app/models/activity';

export default defineComponent({
  props: {
    activity: {
      type: Object as () => Activity,
      required: true,
    },
  },
  setup(props) {
    const dateFormatted = computed<string>(() =>
      format(props.activity.date!, 'dd MMM yyyy h:mm aa')
    );

    return {
      dateFormatted,
    };
  },
});
</script>