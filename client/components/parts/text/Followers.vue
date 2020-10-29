<template>
  <span
    :title="text"
    :class="{ ['subtext--text']: subtext }"
  >
    <template v-if="icon">
      <v-icon
        :size="iconSize"
        :color="subtext ? 'subtext' : undefined"
      >
        mdi-account-multiple
      </v-icon>
      <span :style="textStyles">
        {{ text }}
      </span>
    </template>

    <template v-else>
      {{ text }}
    </template>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { getFollowersText } from '~/services/converter';
import { SpotifyAPI } from '~~/types';

export default defineComponent({
  props: {
    followers: {
      type: Object as PropType<SpotifyAPI.Followers>,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    subtext: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const textStyles = props.size != null
      ? { fontSize: `${props.size}px` }
      : undefined;
    const iconSize = props.size != null
      ? Math.floor(props.size * 1.25)
      : undefined;
    const text = computed(() => getFollowersText(props.followers.total));

    return {
      textStyles,
      iconSize,
      text,
    };
  },
});
</script>
