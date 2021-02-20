<template>
  <div class="ui segments">
    <div class="ui basic attached top segment" style="padding: 0">
      <img
        :src="`/assets/categoryImages/${activity.category}.jpg`"
        class="ui fluid image"
        style="filter: brightness(30%)"
      />
      <div
        class="ui basic segment"
        style="
          position: absolute;
          bottom: 5%;
          left: 5%;
          width: 100%;
          height: auto;
          color: white;
        "
      >
        <div class="ui items">
          <div class="item">
            <div class="content">
              <div class="ui huge header" style="color: white">
                {{ activity.title }}
              </div>
              <p>{{ dateFormatted }}</p>
              <p>Hosted by <strong>Bob</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ui clearing bottom attached segment">
      <button class="ui teal button">Join Activity</button>
      <button class="ui button">Cancel attendance</button>
      <router-link
        :to="{ name: MANAGE_ACTIVITY_PAGE_NAME, params: { id: activity.id } }"
        class="ui orange right floated button"
        >Manage Event</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { format } from 'date-fns';
import { MANAGE_ACTIVITY_PAGE_NAME } from '../../../app/constants/routes';
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
      MANAGE_ACTIVITY_PAGE_NAME,
    };
  },
});
</script>