<template>
  <div
    class="ui teal inverted secondary top attached center aligned segment"
    style="border: none"
  >
    3 People Going
  </div>
  <div class="ui attached segment">
    <div class="ui divided relaxed list" role="list">
      <div class="item" style="position: relative">
        <div class="ui orange right ribbon label" style="position: absolute">
          Host
        </div>
        <img src="/assets/user.png" class="ui tiny image" />
        <div class="middle aligned content">
          <h3 class="header">
            <router-link to="#">Bob</router-link>
          </h3>
          <div class="extra" style="color: orange">Following</div>
        </div>
      </div>
      <div class="item" style="position: relative">
        <img src="/assets/user.png" class="ui tiny image" />
        <div class="middle aligned content">
          <h3 class="header">
            <router-link to="#">Tom</router-link>
          </h3>
          <div class="extra" style="color: orange">Following</div>
        </div>
      </div>
    </div>
  </div>
</template>