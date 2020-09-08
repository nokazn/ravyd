<template>
  <div
    :title="userName"
    :class="{
      [$style.inline]: inline
    }"
  >
    <UserAvatar
      v-if="avatar && src != null"
      :src="src"
      :size="SIZE_OF_AVATAR"
      :alt="userName"
      :class="$style.UserName__avatar"
    />
    <nuxt-link :to="userPath">
      {{ userName }}
    </nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI } from '~~/types';

const SIZE_OF_AVATAR = 28;

type Data = {
  SIZE_OF_AVATAR: number
}

export default Vue.extend({
  components: {
    UserAvatar,
  },

  props: {
    user: {
      type: Object as PropType<SpotifyAPI.UserData>,
      required: true,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      SIZE_OF_AVATAR,
    };
  },

  computed: {
    src(): string | undefined {
      return getImageSrc(this.user.images, SIZE_OF_AVATAR);
    },
    userPath(): string {
      return `/users/${this.user.id}`;
    },
    userName(): string {
      return this.user.display_name ?? this.user.id;
    },
  },
});
</script>

<style lang="scss" module>
.UserName__avatar {
  margin-right: 0.1rem;
}

.inline {
  display: inline;
}
</style>
