<template>
  <div
    :class="{
      [$style.inline]: inline,
      [$style.ArtistNames]: true,
    }"
    :title="artistNames"
  >
    <template v-if="text">
      <span :title="name">
        {{ artistNames }}
      </span>
    </template>

    <template v-else>
      <template v-for="({ images, name, id }, index) in artists">
        <UserAvatar
          v-if="avatar && hasImages(images)"
          :key="`${id}-image`"
          :src="getImageSrc(images, SIZE_OF_AVATAR)"
          :alt="name"
          :title="name"
          :size="SIZE_OF_AVATAR"
          :class="$style.ArtistNames__avatar"
        />

        <v-icon
          v-else-if="avatar && hasMultipleArtists"
          :key="`${id}-icon`"
          :size="SIZE_OF_AVATAR"
          :class="$style.ArtistNames__avatar"
        >
          mdi-account-circle-outline
        </v-icon>

        <nuxt-link
          :key="id"
          :to="artistPath(id)"
          :title="name"
          @click.native.stop="onClicked"
        >
          {{ name }}
        </nuxt-link>
        <span
          v-if="index !== artists.length - 1 && !avatar"
          :key="`${id}-comma`"
        >, </span>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/utils/image/getImageSrc';
import { App, SpotifyAPI } from '~~/types';

const ON_CLICKED = 'on-clicked';
const SIZE_OF_AVATAR = 28;

type Data = {
  getImageSrc: typeof getImageSrc
  artistPath: (id: string) => string
  hasImages: (images: SpotifyAPI.Image[] | undefined) => boolean
  SIZE_OF_AVATAR: number
}

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  components: {
    UserAvatar,
  },

  props: {
    artists: {
      type: Array as PropType<(App.SimpleArtistInfo | SpotifyAPI.Artist)[]>,
      required: true,
    },
    text: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const artistPath = (id: string) => `/artists/${id}`;
    const hasImages = (images: SpotifyAPI.Image[] | undefined) => (images?.length ?? 0) > 0;
    return {
      getImageSrc,
      hasImages,
      artistPath,
      SIZE_OF_AVATAR,
    };
  },

  computed: {
    artistNames(): string {
      return this.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    hasMultipleArtists(): boolean {
      return this.artists.length > 1;
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_CLICKED);
    },
  },
});
</script>

<style lang="scss" module>
.ArtistNames {
  &__avatar {
    margin-right: 0.1rem;

    &:not(:first-child) {
      margin-left: 1rem;
    }
  }
}

.inline {
  display: inline;
}
</style>
