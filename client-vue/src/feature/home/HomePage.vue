<template>
  <div class="ui inverted vertical center aligned segment masthead">
    <div class="ui text container">
      <h1 class="ui inverted header">
        <img
          src="/assets/logo.png"
          class="ui massive image"
          style="margin-bottom: 12px; margin-right: -2px"
        />
        Reactivities
      </h1>
    </div>
    <h2 class="ui inverted header">Welcome to Reactivities</h2>
    <router-link
      :to="{ name: ACTIVITY_DASHBOARD_PAGE_NAME }"
      class="ui huge inverted button"
    >
      Take me to the Activities!
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { ACTIVITY_DASHBOARD_PAGE_NAME } from '../../app/constants/routes';
</script>

<style scoped>
.ui.inverted.vertical.center.aligned.segment.masthead {
  justify-content: center;
  flex-direction: column;
}
</style>
