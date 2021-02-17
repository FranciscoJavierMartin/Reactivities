<template>
  <div class="ui container">
    <h1 class="ui header">Server Error</h1>
    <h5 class="ui red sub header">This is a server error</h5>
    <div class="ui segment">
      <h4 class="ui teal header">Stack trace</h4>
      <code style="margin-top: 10px">
        {{ message }}
      </code>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '../../app/store';

export default defineComponent({
  setup() {
    const store = useStore();

    const details = computed(() => {
      return store.getters.getError?.details;
    });
    const message = computed(() => {
      return store.getters.getError?.message;
    });

    return {
      details,
      message,
    };
  },
});
</script>