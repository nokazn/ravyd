<template>
  <v-card
    hover
    ripple
    tile
    :width="width"
    :class="$style.ReleaseCard"
    @click="onClick">
    <div :class="$style.ReleaseCard__container">
      <release-artwork
        :src="artworkSrc"
        :size="width"
        :alt="name"
        :title="name"
        is-overlayed
        :icon="mediaIcon"
        @on-media-button-clicked="onMediaButtonClicked" />

      <v-card-title :class="$style.ReleaseCard__title">
        <nuxt-link :to="releasePath">
          {{ name }}
        </nuxt-link>
      </v-card-title>

      <v-card-subtitle :class="$style.ReleaseCard__subtitle">
        <template v-if="yearSubtitle">
          <span v-text="releaseYear" />
        </template>

        <template v-else>
          <template
            v-for="({
              name: artistName,
              id: artistId
            }, index) in artists">
            <nuxt-link
              :key="artistId"
              :to="artistPath(artistId)"
              @click.native.stop>
              {{ artistName }}
            </nuxt-link>

            <span
              v-if="index !== artists.length - 1"
              :key="`${artistId}-comma`">, </span>
          </template>
        </template>
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ReleaseArtwork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtwork.vue';
import { hasProp } from '~~/utils/hasProp';
import { App } from '~~/types';

export type ReleaseCardInfo = App.ReleaseCardInfo

export default Vue.extend({
  components: {
    ReleaseArtwork,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
    uri: {
      type: String,
      required: true,
    },
    artists: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    releaseYear: {
      type: String,
      default: undefined,
    },
    artworkSrc: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 160,
    },
    yearSubtitle: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    releasePath(): string {
      return `/releases/${this.releaseId}`;
    },
    artistsName(): string {
      return this.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    artistPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },

    isPlaying(): boolean {
      return this.$state().player.isPlaying;
    },
    isReleaseSet(): boolean {
      // トラックのカードでトラックがセットされているか、アルバムのカードでアルバムがセットされているか
      return (this.uri.includes('track') && this.$getters()['player/isTrackSet'](this.id))
        || (this.uri.includes('album') && this.$getters()['player/isAlbumSet'](this.id));
    },

    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isReleaseSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  methods: {
    onClick() {
      this.$router.push(this.releasePath);
    },
    onMediaButtonClicked() {
      // 現在再生中のトラック/アルバムの場合
      if (this.isPlaying && this.isReleaseSet) {
        this.$dispatch('player/pause');
      } else {
        // トラックとアルバムのカードで場合分け
        const uri = this.uri.includes('track')
          ? { trackUriList: [this.uri] }
          : { contextUri: this.uri };
        // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
        this.$dispatch('player/play', this.isReleaseSet
          ? undefined
          : uri);
      }
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseCard {
  &__container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-size: 0.9rem;
    padding: 12px 8px;
    line-height: 1rem;
  }
  &__subtitle {
    font-size: 0.7rem;
    padding: 8px;
    line-height: 1rem;
    margin-top: -4px!important;
  }
}
</style>
