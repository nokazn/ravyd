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
        :icon="releaseArtWorkIcon"
        @on-media-button-clicked="onMediaButtonClicked" />

      <v-card-title :class="$style.ReleaseCard__title">
        <nuxt-link :to="releasePath">
          {{ releaseName }}
        </nuxt-link>
      </v-card-title>

      <v-card-subtitle :class="$style.ReleaseCard__subtitle">
        <template
          v-for="({ name, id }, index) in artists">
          <nuxt-link
            :key="id"
            :to="artistPath(id)">
            {{ name }}
          </nuxt-link>

          <span
            v-if="index !== artists.length - 1"
            :key="`${id}-comma`">, </span>
        </template>
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ReleaseArtWork, { ReleaseArtWorkIcon } from '~/components/parts/avatar/ReleaseArtWork.vue';
import { hasProp } from '~~/utils/hasProp';

export type ReleaseCardInfo = {
  releaseName: string
  releaseId: string
  releaseUri: string
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
    releaseName: {
      type: String,
      required: true,
    },
    releaseId: {
      type: String,
      required: true,
    },
    releaseUri: {
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
      return `${this.releaseName} - ${this.artistsName}`;
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
    isAlbumSet(): boolean {
      return this.$getters()['player/isAlbumSet'](this.releaseId);
    },
    releaseArtWorkIcon(): ReleaseArtWorkIcon {
      return this.isPlaying && this.isAlbumSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  methods: {
    onClick() {
      this.$router.push(this.releasePath);
    },
    onMediaButtonClicked() {
      // 現在再生中のトラックの場合
      if (this.isPlaying && this.isAlbumSet) {
        this.$dispatch('player/pause');
      } else {
        const payload = this.isAlbumSet
          ? undefined
          : { contextUri: this.releaseUri };
        this.$dispatch('player/play', payload);
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
    font-size: 0.78rem;
    padding: 12px 8px;
    line-height: 1rem;
  }
  &__subtitle {
    font-size: 0.7rem;
    padding: 8px;
    line-height: 1rem;
    margin-top: -8px!important;
  }
}
</style>
