<template>
  <nuxt-link
    v-if="text != null"
    :to="userPath"
  >
    {{ text }}
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<SpotifyAPI.UserData>,
      required: true,
    },
  },

  computed: {
    userPath(): string {
      return `/users/${this.user.id}`;
    },
    text(): string | null {
      return this.user.display_name;
    },
  },
});
</script>
