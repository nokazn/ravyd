<template>
  <Card
    :to="playlistPath"
    :width="width"
    :min-width="minWidth || width"
    :max-width="maxWidth || width"
    :class="$style.PlaylistCard"
  >
    <template #image>
      <ReleaseArtwork
        is-overlayed
        :src="artworkSrc"
        :alt="name"
        :title="name"
        :size="width"
        :min-size="minWidth || width"
        :max-size="maxWidth || width"
        :icon="mediaIcon"
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
        :title="description"
        :class="$style.PlaylistCard__text"
        v-html="description"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import Card from '~/components/parts/card/Card.vue';
import ReleaseArtwork, { MediaIcon } from '~/components/parts/image/ReleaseArtwork.vue';
import { getImageSrc } from '~/utils/image';
import { App, SpotifyAPI } from '~~/types';

export type PlaylistCardInfo = App.PlaylistCardInfo

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
    description: {
      type: String,
      required: true,
    },
    uri: {
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
    playlistPath(): string {
      return `/playlists/${this.id}`;
    },
    isPlaylistSet(): boolean {
      return this.$getters()['playback/isContextSet'](this.uri);
    },
    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
    },

    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isPlaylistSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中の場合
      if (this.isPlaylistSet) {
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

<style lang="scss" module>
.PlaylistCard {
  &__text {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
