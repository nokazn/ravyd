<template>
  <div
    :title="userName"
    :class="{
      [$style.inline]: inline
    }"
  >
    <UserAvatar
      v-if="avatar"
      type="user"
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
import { defineComponent, computed, PropType } from '@vue/composition-api';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/services/converter';
import type { SpotifyAPI } from '~~/types';

const SIZE_OF_AVATAR = 28;

export default defineComponent({
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

  setup(props) {
    const src = computed(() => getImageSrc(props.user.images, SIZE_OF_AVATAR));
    const userPath = computed(() => `/users/${props.user.id}`);
    const userName = computed(() => props.user.display_name ?? props.user.id);

    return {
      SIZE_OF_AVATAR,
      src,
      userPath,
      userName,
    };
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
