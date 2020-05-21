<template>
  <v-card
    hover
    ripple
    tile
    :width="width"
    :class="$style.ReleaseCard"
    @click="onClick">
    <div :class="$style.ReleaseCard__container">
      <release-art-work
        :src="src"
        :alt="alt"
        :size="width"
        is-overlayed
        :icon="mediaIcon"
        @on-media-button-clicked="onMediaButtonClicked" />

      <v-card-title :class="$style.ReleaseCard__title">
        <nuxt-link :to="releasePath">
          {{ name }}
        </nuxt-link>
      </v-card-title>

      <v-card-subtitle :class="$style.ReleaseCard__subtitle">
        <template
          v-for="({
            name: artistName,
            id: artistId
          }, index) in artists">
          <nuxt-link
            :key="artistId"
            :to="artistPath(artistId)">
            {{ artistName }}
          </nuxt-link>

          <span
            v-if="index !== artists.length - 1"
            :key="`${artistId}-comma`">, </span>
        </template>
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReleaseArtWork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtWork.vue';
import { hasProp } from '~~/utils/hasProp';

export type ReleaseCardInfo = {
  type: 'album' | 'track'
  name: string //  track または album の name
  id: string //  track または album の id
  releaseId: string
  uri: string
  artists: {
    name: string
    id: string
  }[]
  src: string
  width?: number
}

export default Vue.extend({
  components: {
    ReleaseArtWork,
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
      type: Array as PropType<ReleaseCardInfo['artists']>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    src: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 160,
    },
  },

  computed: {
    alt(): string {
      return `${this.name} by ${this.artistsName}`;
    },
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
    font-weight: bold;
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
