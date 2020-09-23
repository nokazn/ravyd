<template>
  <Card
    :width="width"
    :min-width="width"
    :max-width="maxWidth || width"
    @click="onCardClicked"
  >
    <template #image>
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
    </template>

    <template #title>
      <nuxt-link
        :to="releasePath"
        :title="name"
        class="g-ellipsis-text"
      >
        {{ name }}
      </nuxt-link>
    </template>

    <template #subtitle>
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
          :artists="artists"
          class="g-ellipsis-text"
        />
      </template>
    </template>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RawLocation } from 'vue-router';
import { RootState } from 'typed-vuex';

import Card from '~/components/parts/card/Card.vue';
import ReleaseArtwork, { MediaIcon } from '~/components/parts/image/ReleaseArtwork.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { getImageSrc } from '~/utils/image';
import { hasProp } from '~~/utils/hasProp';
import { SpotifyAPI, App } from '~~/types';

export default Vue.extend({
  components: {
    Card,
    ReleaseArtwork,
    ArtistNames,
  },

  props: {
    type: {
      type: String as PropType<App.ReleaseCardInfo['type']>,
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

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.images, this.maxWidth ?? this.width);
    },
    releasePath(): RawLocation {
      const path = `/releases/${this.releaseId}`;
      if (this.type === 'album') return path;

      return {
        path,
        query: { track: this.id },
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
