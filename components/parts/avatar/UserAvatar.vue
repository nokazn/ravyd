<template>
  <v-avatar
    v-if="src"
    :size="size"
    class="user-avatar">
    <img
      :src="src"
      alt="user-avatar">
  </v-avatar>
  <v-icon
    v-else
    :size="size"
    class="user-avatar">
    {{ defaultIcon }}
  </v-icon>
</template>

<script lang="ts">
import Vue from 'vue';

export type Src = string | null;

export default Vue.extend({
  props: {
    src: {
      required: true,
      validator(value) {
        return typeof value === 'string' || value == null;
      },
    },
    size: {
      type: [Number, String],
      default: 20,
    },
    defaultIcon: {
      type: String,
      default: 'mdi-account-circle-outline',
    },
  },
});
</script>
