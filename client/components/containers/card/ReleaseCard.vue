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
          class="g-ellipsis-text"
        >
          <template v-if="discograpy">
            <time
              v-if="releaseYear != null"
              :datetime="releaseYear"
            >
              {{ releaseYear }}
            </time>
          </template>

          <template v-else>
            <template
              v-for="({
                name: artistName,
                id: artistId
              }, index) in artists"
            >
              <nuxt-link
                :key="artistId"
                :to="`/artists/${artistId}`"
                :title="artistsName"
                @click.native.stop
              >
                {{ artistName }}
              </nuxt-link><span
                v-if="index !== artists.length - 1"
                :key="`${artistId}-comma`"
              >, </span>
            </template>
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
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { hasProp } from '~~/utils/hasProp';
import { SpotifyAPI, App } from '~~/types';

export type Data = {
  isLoaded: boolean
  releasePath: RawLocation
  artistsName: string
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
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
    artworkList: {
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
    const releasePath = {
      path: `/releases/${this.releaseId}`,
      hash: this.hash,
    };
    const artistsName = this.artists
      .map((artist) => artist.name)
      .join(', ');

    return {
      isLoaded: false,
      releasePath,
      artistsName,
    };
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.artworkList, this.maxWidth ?? this.width);
    },
    isReleaseSet(): boolean {
      // トラックのカードでトラックがセットされているか、アルバムのカードでアルバムがセットされているか
      return (this.type === 'track' && this.$getters()['player/isTrackSet'](this.id))
        || (this.type === 'album' && this.$getters()['player/isContextSet'](this.uri));
    },
    isPlaying(): RootState['player']['isPlaying'] {
      return this.$state().player.isPlaying;
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
          ? 'player/pause'
          : 'player/play');

        return;
      }

      // トラックとアルバムのカードで場合分け
      const params = this.type === 'track'
        ? { trackUriList: [this.uri] }
        : { contextUri: this.uri };
      // プレイヤーにセットされた release の場合は一時停止中のトラックをそのまま再生する
      this.$dispatch('player/play', params);
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
