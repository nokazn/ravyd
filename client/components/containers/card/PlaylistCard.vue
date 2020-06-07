<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="card"
      boilerplate
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
    />
    <v-card
      v-else
      hover
      ripple
      nuxt
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
      :class="$style.PlaylistCard"
      :to="playlistPath"
    >
      <div :class="$style.PlaylistCard__container">
        <release-artwork
          :src="artworkSrc"
          :alt="name"
          :title="name"
          is-overlayed
          :icon="mediaIcon"
          @on-media-button-clicked="onMediaButtonClicked"
        />

        <v-card-title :class="$style.PlaylistCard__title">
          <span
            :title="name"
            class="g-ellipsis-text"
            v-text="name"
          />
        </v-card-title>

        <v-card-subtitle
          :class="$style.PlaylistCard__text"
          v-text="description"
        />
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtwork.vue';
import { App } from '~~/types';

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
    artworkSrc: {
      type: String,
      required: true,
    },
    width: {
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
    isPlaying(): boolean {
      return this.$state().player.isPlaying;
    },
    // @todo
    isPlaylistSet(): boolean {
      // トラックのカードでトラックがセットされているか、アルバムのカードでアルバムがセットされているか
      return false;
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
        this.$dispatch('player/pause');
      } else {
        const params = this.isPlaylistSet
          ? undefined
          : { contextUri: this.uri };
        // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
        this.$dispatch('player/play', params);
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
    font-size: 0.9rem;
    padding: 12px 8px;
    line-height: 1.2rem;
  }
  &__text {
    font-size: 0.8rem;
    padding: 12px 8px;
    line-height: 1rem;
    margin-top: -4px!important;
  }
}
</style>
