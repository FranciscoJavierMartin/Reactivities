<template>
  <div class="ui segment">
    <div class="ui active dimmer">
      <div class="ui massive text loader">{{ content }}</div>
    </div>
    <p></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    inverted: {
      type: Boolean,
      required: false,
    },
  },
});
</script>

<style scoped>
.ui.segment {
  width: 100%;
  height: 100vh;
}
</style>

