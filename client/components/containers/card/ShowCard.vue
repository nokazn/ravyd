<template>
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
    :to="showPath"
    :width="width"
    :min-width="width"
    :max-width="maxWidth || width"
    :class="$style.ShowCard"
  >
    <div :class="$style.ShowCard__container">
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

      <v-card-title
        :title="name"
        :class="$style.ShowCard__title"
      >
        <span class="g-ellipsis-text">
          {{ name }}
        </span>
      </v-card-title>

      <v-card-subtitle
        :title="publisher"
        :class="$style.ShowCard__subtitle"
        class="g-ellipsis-text"
      >
        {{ publisher }}
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import ReleaseArtwork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtwork.vue';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { SpotifyAPI } from '~~/types';

export type Data = {
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

  data(): Data {
    return {
      isLoaded: false,
    };
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

  mounted() {
    this.isLoaded = true;
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中の場合
      if (this.isShowSet) {
        this.$dispatch(this.isPlaying
          ? 'playback/pause'
          : 'playback/play');

        return;
      }

      this.$dispatch('playback/play', {
        contextUri: this.uri,
      });
    },
  },
});
</script>

<style lang="scss" module>
.ShowCard {
  &__container {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 0.9em;
    line-height: 1.3em;
  }

  &__subtitle {
    font-size: 0.8em;
    line-height: 1.2em;
    margin-top: -8px !important;
  }
}
</style>
