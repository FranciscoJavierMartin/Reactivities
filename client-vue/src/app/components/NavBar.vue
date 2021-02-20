<template>
  <div class="ui inverted top fixed menu">
    <div class="ui container">
      <router-link class="header item" :to="{ name: HOME_PAGE_NAME }">
        <img
          src="../../assets/logo.png"
          alt="logo"
          style="margin-right: 10px"
        />
        Reactivities</router-link
      >
      <router-link
        :to="{ name: ACTIVITY_DASHBOARD_PAGE_NAME }"
        class="item"
        active-class="active"
        >Activities</router-link
      >
      <router-link
        :to="{ name: TEST_ERROR_PAGE_NAME }"
        class="item"
        active-class="active"
        >Error</router-link
      >
      <div class="item">
        <router-link
          :to="{ name: CREATE_ACTIVITY_PAGE_NAME }"
          class="ui positive button"
          role="button"
        >
          Create Activity
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  HOME_PAGE_NAME,
  ACTIVITY_DASHBOARD_PAGE_NAME,
  TEST_ERROR_PAGE_NAME,
  CREATE_ACTIVITY_PAGE_NAME,
} from '../constants/routes';

export default defineComponent({
  setup() {
    return {
      HOME_PAGE_NAME,
      ACTIVITY_DASHBOARD_PAGE_NAME,
      TEST_ERROR_PAGE_NAME,
      CREATE_ACTIVITY_PAGE_NAME,
    };
  },
});
</script>
