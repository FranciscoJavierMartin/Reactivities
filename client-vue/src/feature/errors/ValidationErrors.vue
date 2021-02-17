<template>
  <div class="ui error message">
    <ul class="list">
      <li class="content" v-for="(error, i) in errors" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    errors: {
      type: Array as () => String[],
      required: true,
    },
  },
});
</script>