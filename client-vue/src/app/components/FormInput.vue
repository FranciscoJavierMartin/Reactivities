<template>
  <div class="field">
    <div class="ui input">
      <input
        :type="inputType"
        :placeholder="placeholder"
        :name="name"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    inputType: {
      type: String as () => 'text' | 'date' | 'password',
      required: false,
      default: 'text',
    },
    placeholder: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: {
    'update:modelValue': (value: string) => {
      return typeof value !== 'string';
    },
  },
});
</script>