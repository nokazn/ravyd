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
        :src="artworkSrc"
        :alt="name"
        :size="width"
        :min-size="minWidth || width"
        :max-size="maxWidth || width"
        :icon="mediaIcon"
        :title="name"
        @on-media-button-clicked="onMediaButtonClicked"
      />
    </template>

    <template #title>
      <span
        :title="name"
        class="g-ellipsis-text"
      >
        {{ name }}
      </span>
    </template>

    <template #subtitle>
      <span
        :title="publisher"
        class="g-ellipsis-text"
      >
        {{ publisher }}
      </span>
    </template>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import Card from '~/components/parts/card/Card.vue';
import ReleaseArtwork, { MediaIcon } from '~/components/parts/image/ReleaseArtwork.vue';
import { getImageSrc } from '~/utils/image';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  components: {
    Card,
    ReleaseArtwork,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array as PropType<SpotifyAPI.Image[]>,
      required: true,
    },
    externalUrls: {
      type: Object as PropType<SpotifyAPI.ExternalUrls>,
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

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.images, this.maxWidth ?? this.width);
    },
    showPath(): string {
      return `/shows/${this.id}`;
    },
    isShowSet(): boolean {
      return this.$getters()['playback/contextUri'] === this.uri;
    },
    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
    },
    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isShowSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中の場合
      if (this.isShowSet) {
        this.$dispatch(this.isPlaying
          ? 'playback/pause'
          : 'playback/play');
      } else {
        this.$dispatch('playback/play', {
          contextUri: this.uri,
        });
      }
    },
  },
});
</script>
