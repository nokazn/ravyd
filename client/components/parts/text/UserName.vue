<template>
  <nuxt-link
    v-if="user != null && text != null"
    :to="to"
  >
    {{ text }}
  </nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SpotifyAPI } from '~~/types';

export type Data = {
  to: string
  text: string | null
}

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<SpotifyAPI.UserData>,
      required: true,
    },
  },

  data(): Data {
    return {
      to: `/users/${this.user.id}`,
      text: this.user.display_name,
    };
  },
});
</script>
