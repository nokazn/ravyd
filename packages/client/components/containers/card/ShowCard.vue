<template>
  <Card
    :to="showPath"
    :width="width"
    :min-width="width"
    :max-width="maxWidth || width"
  >
    <template #image>
      <ReleaseArtwork
        overlay
        :border-radius="2"
        :src="artworkSrc"
        :alt="item.name"
        :size="width"
        :min-size="minWidth || width"
        :max-size="maxWidth || width"
        :icon="mediaIcon"
        :title="item.name"
        @on-media-button-clicked="onMediaButtonClicked"
      />
    </template>

    <template #title>
      <span
        :title="item.name"
        class="g-ellipsis-text"
      >
        {{ item.name }}
      </span>
    </template>

    <template #subtitle>
      <span
        :title="item.publisher"
        class="g-ellipsis-text"
      >
        {{ item.publisher }}
      </span>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import type { SpotifyAPI } from 'shared/types';
import Card from '~/components/parts/card/Card.vue';
import ReleaseArtwork, { MediaIcon } from '~/components/parts/image/ReleaseArtwork.vue';
import { getImageSrc } from '~/services/converter';

export default defineComponent({
  components: {
    Card,
    ReleaseArtwork,
  },

  props: {
    item: {
      type: Object as PropType<SpotifyAPI.SimpleShow>,
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
    const artworkSrc = computed(() => getImageSrc(
      props.item.images,
      props.maxWidth ?? props.width,
    ));
    const showPath = computed(() => `/shows/${props.item.id}`);
    const isShowSet = computed(() => root.$getters()['playback/isContextSet'](props.item.uri));
    const isPlaying = computed(() => root.$getters()['playback/isPlaying']);
    const mediaIcon = computed<MediaIcon>(() => {
      return isShowSet.value && isPlaying.value
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    });
    const onMediaButtonClicked = () => {
      if (isShowSet.value) {
        root.$dispatch(isPlaying.value
          ? 'playback/pause'
          : 'playback/play');
      } else {
        root.$dispatch('playback/play', { context: props.item.uri });
      }
    };

    return {
      artworkSrc,
      showPath,
      isShowSet,
      isPlaying,
      mediaIcon,
      onMediaButtonClicked,
    };
  },
});
</script>
