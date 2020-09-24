<template>
  <Card
    :to="artistPath"
    :width="width"
    :min-width="minWidth || width"
    :max-width="maxWidth || width"
    :class="$style.ArtistCard"
  >
    <template #image>
      <div :class="$style.ArtistCard__avatar">
        <UserAvatar
          :src="avatarSrc"
          :alt="name"
          :size="avatarSize"
          :min-size="minWidth"
          :max-size="avatarMaxSize"
          :icon="mediaIcon"
          default-user-icon="mdi-account-music"
          small-icon
          :title="name"
          is-overlayed
          @on-media-button-clicked="onMediaButtonClicked"
        />
      </div>
    </template>

    <template #title>
      <div :class="$style.ArtistCard__title">
        <span
          :title="name"
          class="g-ellipsis-text"
        >
          {{ name }}
        </span>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import Card from '~/components/parts/card/Card.vue';
import UserAvatar, { MediaIcon } from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/utils/image';
import { SpotifyAPI } from '~~/types';

export default Vue.extend({
  components: {
    Card,
    UserAvatar,
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
    uri: {
      type: String,
      required: true,
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
  },

  computed: {
    artistPath(): string {
      return `/artists/${this.id}`;
    },
    avatarSrc(): string | undefined {
      return getImageSrc(this.images, this.maxWidth ?? this.width);
    },
    isArtistSet(): boolean {
      return this.$getters()['playback/isContextSet'](this.uri);
    },
    isPlaying(): RootState['playback']['isPlaying'] {
      return this.$state().playback.isPlaying;
    },

    mediaIcon(): MediaIcon {
      return this.isPlaying && this.isArtistSet
        ? 'mdi-pause-circle'
        : 'mdi-play-circle';
    },
    avatarSize(): number | undefined {
      const { width } = this;
      return width != null
        ? width * 0.95
        : undefined;
    },
    avatarMaxSize(): number | undefined {
      const { maxWidth } = this;
      return maxWidth != null
        ? maxWidth * 0.97
        : undefined;
    },
  },

  methods: {
    onMediaButtonClicked() {
      // 現在再生中の場合
      if (this.isArtistSet) {
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
.ArtistCard {
  &__avatar {
    display: flex;
    justify-content: center;
    margin-top: 0.5em;
  }

  &__title {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
