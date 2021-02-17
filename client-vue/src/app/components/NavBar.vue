<template>
  <div class="ui inverted top fixed menu">
    <div class="ui container">
      <router-link class="header item" to="/">
        <img src="../../assets/logo.png" alt="logo" style="marginright: 10px" />
        Reactivities</router-link
      >
      <router-link to="/activities" class="item" active-class="active"
        >Activities</router-link
      >
      <router-link to="/errors" class="item" active-class="active"
        >Error</router-link
      >
      <div class="item">
        <router-link
          to="/createActivity"
          class="ui positive button"
          role="button"
        >
          Create Activity
        </router-link>
      </div>
    </div>
  </div>
</template>