<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="card"
      boilerplate
      :width="width"
      :min-width="minWidth || width"
      :max-width="maxWidth || width"
    />
    <v-card
      v-else
      hover
      ripple
      nuxt
      :to="artistPath"
      :width="width"
      :min-width="minWidth || width"
      :max-width="maxWidth || width"
      :class="$style.ArtistCard"
    >
      <div :class="$style.ArtistCard__container">
        <div :class="$style.ArtistCard__avatar">
          <UserAvatar
            :src="avatarSrc"
            :alt="name"
            :size="width"
            :min-size="minWidth"
            :max-size="maxWidth"
            :icon="mediaIcon"
            default-user-icon="mdi-account-music"
            small-icon
            :title="name"
            is-overlayed
            @on-media-button-clicked="onMediaButtonClicked"
          />
        </div>

        <v-card-title
          :title="name"
          :class="$style.ArtistCard__title"
        >
          <span class="g-ellipsis-text">
            {{ name }}
          </span>
        </v-card-title>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RootState } from 'typed-vuex';

import UserAvatar, { MediaIcon } from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/utils/image/getImageSrc';
import { SpotifyAPI } from '~~/types';

type Data = {
  isLoaded: boolean
}

export default Vue.extend({
  components: {
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

  data(): Data {
    return {
      isLoaded: false,
    };
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
  },

  mounted() {
    this.isLoaded = true;
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
  &__container {
    display: flex;
    flex-direction: column;
  }

  &__avatar {
    display: flex;
    justify-content: center;
    margin-top: 0.5em;
  }

  &__title {
    display: flex;
    justify-content: center;
    font-size: 0.9em;
    line-height: 1.3em;
  }
}
</style>
