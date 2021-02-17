<template>
  <h1 class="ui header">Test Error component</h1>
  <div class="ui segment">
    <div class="ui seven buttons">
      <button class="ui basic primary button" @click="handleNotFound">
        Not Found
      </button>
      <button class="ui basic primary button" @click="handleBadRequest">
        Bad Request
      </button>
      <button class="ui basic primary button" @click="handleValidationError">
        Validation Error
      </button>
      <button class="ui basic primary button" @click="handleServerError">
        Server Error
      </button>
      <button class="ui basic primary button" @click="handleUnauthorized">
        Unauthorized
      </button>
      <button class="ui basic primary button" @click="handleBadGuid">
        Bad Guid
      </button>
    </div>
  </div>
  <ValidationErrors v-if="errors" :errors="errors" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import ValidationErrors from './ValidationErrors.vue';

const baseURL = import.meta.env.VITE_BASE_URL || '';

export default defineComponent({
  components: {
    ValidationErrors,
  },
  setup() {
    const errors = ref<string[] | null>(null);

    const handleNotFound = () => {
      axios
        .get(`${baseURL}buggy/not-found`)
        .catch((err) => console.log(err.response));
    };

    const handleBadRequest = () => {
      axios
        .get(`${baseURL}buggy/bad-request`)
        .catch((err) => console.log(err.response));
    };

    const handleServerError = () => {
      axios
        .get(`${baseURL}buggy/server-error`)
        .catch((err) => console.log(err.response));
    };

    const handleUnauthorized = () => {
      axios
        .get(`${baseURL}buggy/unauthorised`)
        .catch((err) => console.log(err.response));
    };

    const handleBadGuid = () => {
      axios
        .get(`${baseURL}buggy/notaguid`)
        .catch((err) => console.log(err.response));
    };

    const handleValidationError = () => {
      axios
        .post(`${baseURL}activities`, {})
        .catch((err) => (errors.value = err));
    };

    return {
      handleNotFound,
      handleBadRequest,
      handleServerError,
      handleUnauthorized,
      handleBadGuid,
      handleValidationError,
      errors,
    };
  },
});
</script>