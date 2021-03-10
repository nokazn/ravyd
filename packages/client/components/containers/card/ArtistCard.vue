<template>
  <Card
    :to="artistPath"
    :width="width"
    :min-width="minWidth || width"
    :max-width="maxWidth || width"
    :class="$style.ArtistCard"
  >
    <template #image>
      <div :class="$style.ArtistCard__avatar">
        <Avatar
          overlay
          type="artist"
          :src="avatarSrc"
          :alt="item.name"
          :size="avatarSize"
          :min-size="minWidth"
          :max-size="avatarMaxSize"
          :icon="mediaIcon"
          :title="item.name"
          @on-media-button-clicked="onMediaButtonClicked"
        />
      </div>
    </template>

    <template #title>
      <div :class="$style.ArtistCard__title">
        <span
          :title="item.name"
          class="g-ellipsis-text"
        >
          {{ item.name }}
        </span>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { SpotifyAPI } from 'shared/types';
import Card from '~/components/parts/card/Card.vue';
import Avatar, { MediaIcon } from '~/components/parts/image/Avatar.vue';
import { getImageSrc } from '~/services/converter';
import type { App } from '~/entities';

const adjustAvatarSize = (width: number | undefined) => {
  return width != null
    ? width * 0.98
    : undefined;
};

export default defineComponent({
  components: {
    Card,
    Avatar,
  },

  props: {
    item: {
      type: Object as PropType<SpotifyAPI.Artist | App.ContentItem<'artist'>>,
      required: true,
    },
    width: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    minWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    maxWidth: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  setup(props, { root }) {
    const artistPath = computed(() => `/artists/${props.item.id}`);
    const avatarSrc = computed(() => getImageSrc(props.item.images, props.maxWidth ?? props.width));
    const avatarSize = computed(() => adjustAvatarSize(props.width));
    const avatarMaxSize = computed(() => adjustAvatarSize(props.maxWidth));

    const isArtistSet = computed(() => root.$getters()['playback/isContextSet'](props.item.uri));
    const isPlaying = computed(() => root.$getters()['playback/isPlaying']);
    const mediaIcon = computed<MediaIcon>(() => {
      return isArtistSet.value && isPlaying.value
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    });

    const onMediaButtonClicked = () => {
      if (isArtistSet.value) {
        root.$dispatch(isPlaying.value
          ? 'playback/pause'
          : 'playback/play');
      } else {
        root.$dispatch('playback/play', { context: props.item.uri });
      }
    };

    return {
      artistPath,
      avatarSrc,
      avatarSize,
      avatarMaxSize,
      isArtistSet,
      isPlaying,
      mediaIcon,
      onMediaButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.ArtistCard {
  &__avatar {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  &__title {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
