<template>
  <div
    class="ui teal inverted top attached center aligned segment"
    style="border: none"
  >
    <div class="ui header">Chat about this event</div>
  </div>
  <div class="ui attached segment">
    <div class="ui comments">
      <div class="comment">
        <div class="avatar">
          <img src="/assets/user.png" />
        </div>
        <div class="content">
          <router-link to="/" class="author"> Matt </router-link>
          <div class="metadata">
            <div>Today at 5:42PM</div>
          </div>
          <div class="text">How artistic!</div>
          <div class="actions"><a>Reply</a></div>
        </div>
      </div>
      <form class="ui reply form">
        <div class="field">
          <textarea rows="3"></textarea>
        </div>
        <button class="ui icon primary left labeled button">
          <i class="edit icon" />
          Add Reply
        </button>
      </form>
    </div>
  </div>
</template>
