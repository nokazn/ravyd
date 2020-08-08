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
      :width="width"
      :min-width="width"
      :max-width="maxWidth || width"
      :class="$style.ReleaseCard"
      @click="onCardClicked"
    >
      <div :class="$style.ReleaseCard__container">
        <nuxt-link :to="releasePath">
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
        </nuxt-link>

        <v-card-title :class="$style.ReleaseCard__title">
          <nuxt-link
            :to="releasePath"
            :title="name"
            class="g-ellipsis-text"
          >
            {{ name }}
          </nuxt-link>
        </v-card-title>

        <v-card-subtitle
          :class="$style.ReleaseCard__subtitle"
        >
          <template v-if="discograpy">
            <time
              v-if="releaseYear != null"
              :datetime="releaseYear"
              class="g-ellipsis-text"
            >
              {{ releaseYear }}
            </time>
          </template>

          <template v-else>
            <ArtistNames
              :artist-list="artists"
              class="g-ellipsis-text"
            />
          </template>
        </v-card-subtitle>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RawLocation } from 'vue-router';
import { RootState } from 'typed-vuex';

import ReleaseArtwork, { MediaIcon } from '~/components/parts/avatar/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { hasProp } from '~~/utils/hasProp';
import { SpotifyAPI, App } from '~~/types';

type Data = {
  isLoaded: boolean
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    ArtistNames,
  },

  props: {
    type: {
      type: String as PropType<App.ReleaseCardInfo['type']>,
      required: true,
    },
    releaseType: {
      type: String as PropType<App.ReleaseCardInfo['releaseType']>,
      required: true,
    },
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
    hash: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    releaseYear: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    images: {
      type: Array as PropType<SpotifyAPI.Image[]>,
      default: undefined,
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
    // subtitle を releaseYear にする
    discograpy: {
      type: Boolean,
      default: false,
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
    releasePath(): RawLocation {
      return {
        path: `/releases/${this.releaseId}`,
        hash: this.hash,
      };
    },
    isReleaseSet(): boolean {
      // トラックのカードでトラックがセットされているか、アルバムのカードでアルバムがセットされているか
      return (this.type === 'track' && this.$getters()['playback/isTrackSet'](this.id))
        || (this.type === 'album' && this.$getters()['playback/isContextSet'](this.uri));
    },
    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
    },
    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isReleaseSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
  },

  mounted() {
    this.isLoaded = true;
  },

  methods: {
    onCardClicked() {
      this.$router.push(this.releasePath);
    },
    onMediaButtonClicked() {
      // 現在再生中のトラック/アルバムの場合
      if (this.isReleaseSet) {
        this.$dispatch(this.isPlaying
          ? 'playback/pause'
          : 'playback/play');
        return;
      }

      // トラックとアルバムのカードで場合分け
      const params = this.type === 'track'
        ? { trackUriList: [this.uri] }
        : { contextUri: this.uri };
      // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('playback/play', params);
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
