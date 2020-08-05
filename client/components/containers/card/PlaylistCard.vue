<template>
  <v-skeleton-loader
    v-if="!isLoaded"
    type="card"
    boilerplate
    :min-width="minWidth || width"
    :width="width"
    :max-width="maxWidth || width"
  />
  <v-card
    v-else
    hover
    ripple
    nuxt
    :min-width="minWidth || width"
    :width="width"
    :max-width="maxWidth || width"
    :class="$style.PlaylistCard"
    :to="playlistPath"
  >
    <div :class="$style.PlaylistCard__container">
      <ReleaseArtwork
        :src="artworkSrc"
        :alt="name"
        :title="name"
        :min-size="minWidth || width"
        :size="width"
        :max-size="maxWidth || width"
        is-overlayed
        :icon="mediaIcon"
        @on-media-button-clicked="onMediaButtonClicked"
      />

      <v-card-title :class="$style.PlaylistCard__title">
        <span
          :title="name"
          class="g-ellipsis-text"
        >
          {{ name }}
        </span>
      </v-card-title>

      <v-card-subtitle :class="$style.PlaylistCard__text">
        <span
          :title="description"
          v-html="description"
        />
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import ReleaseArtwork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtwork.vue';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App, SpotifyAPI } from '~~/types';

export type PlaylistCardInfo = App.PlaylistCardInfo

export type Data = {
  playlistPath: string
  isLoaded: boolean
}

export default Vue.extend({
  components: {
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
    artworkList: {
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

  data(): Data {
    return {
      playlistPath: `/playlists/${this.id}`,
      isLoaded: false,
    };
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.artworkList, this.maxWidth ?? this.width);
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

  mounted() {
    this.isLoaded = true;
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中のプレイリストの場合
      if (this.isPlaying && this.isPlaylistSet) {
        this.$dispatch('playback/pause');
      } else {
        // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
        const params = this.isPlaylistSet
          ? undefined
          : { contextUri: this.uri };
        this.$dispatch('playback/play', params);
      }
    },
  },
});
</script>

<style lang="scss" module>
.PlaylistCard {
  &__container {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 0.9em;
    line-height: 1.3em;
  }

  &__text {
    font-size: 0.8em;
    line-height: 1.2em;
    margin-top: -8px !important;

    & > * {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
