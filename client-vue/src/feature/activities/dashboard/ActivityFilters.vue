<template>
  <div class="ui large vertical menu">
    <div class="ui teal attached header">
      <i class="filter icon" />
      <div class="content">Filters</div>
    </div>
    <div class="item">All Activities</div>
    <div class="item">I'm going</div>
    <div class="item">I'm hosting</div>
  </div>
  <div class="ui header"></div>
  <Calendar />
</template>

<script>
import { defineComponent } from 'vue';
import { Calendar } from 'v-calendar';

export default defineComponent({
  components: {
    Calendar,
  },
});
</script>