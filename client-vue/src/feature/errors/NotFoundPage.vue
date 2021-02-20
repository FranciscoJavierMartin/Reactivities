<template>
  <div class="ui placeholder segment">
    <div class="ui icon header">
      <i class="search icon" />
      Oops - we've looked everywhere and could not find this.
    </div>
    <div class="inline">
      <router-link
        class="ui primary button"
        :to="{ name: ACTIVITY_DASHBOARD_PAGE_ROUTE }"
      >
        Return to activities page</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ACTIVITY_DASHBOARD_PAGE_ROUTE } from '../../app/constants/routes';

export default defineComponent({
  setup() {
    return {
      ACTIVITY_DASHBOARD_PAGE_ROUTE,
    };
  },
});
</script>