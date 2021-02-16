<template>
  <div class="ui inverted vertical center aligned segment masthead">
    <div class="ui text container">
      <h1 class="ui inverted header">
        <img
          src="/assets/logo.png"
          class="ui massive image"
          :style="{ marginBottom: '12px' }"
        />
        Reactivities
      </h1>
    </div>
    <h2 class="ui inverted header">Welcome to Reactivities</h2>
    <router-link to="/activities" class="ui huge inverted button" role="button">
      Take me to the Activities!
    </router-link>
  </div>
</template>

<style scoped>
.ui.inverted.header {
  display: flex;
  flex-direction: row;
}

.ui.inverted.vertical.center.aligned.segment.masthead {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
