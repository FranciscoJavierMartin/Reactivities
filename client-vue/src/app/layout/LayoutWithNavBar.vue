<template>
  <div>
    <NavBar />
    <div class="ui container" :style="{ marginTop: '7em' }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "../components/NavBar.vue";

export default defineComponent({
  components: {
    NavBar,
  },
});
</script>