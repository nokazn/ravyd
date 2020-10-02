<template>
  <div
    :class="{ [$style.inline]: inline }"
    :title="artistNames"
  >
    <template v-if="text">
      <span :title="name">
        {{ artistNames }}
      </span>
    </template>

    <template v-else>
      <span
        v-for="(artist, index) in artists"
        :key="artist.id"
        :class="$style.Artist"
      >
        <template v-if="avatar">
          <UserAvatar
            v-if="hasImages(artist)"
            type="artist"
            :size="avatarSize"
            :src="getImageSrc(artist, avatarSize)"
            :alt="artist.name"
            :title="artist.name"
            :class="$style.Artist__avatar"
          />
          <v-icon
            v-else-if="hasMultipleArtists"
            :size="avatarSize"
            :class="$style.Artist__avatar"
          >
            mdi-account-circle-outline
          </v-icon>
        </template>

        <nuxt-link
          :to="artistPath(artist.id)"
          :title="artist.name"
          @click.native.stop="onClicked"
        >
          {{ artist.name }}
        </nuxt-link>
        <span v-if="!avatar && index !== artists.length - 1">,&nbsp;</span>
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/utils/image';
import type { App, SpotifyAPI } from '~~/types';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

type Artist = App.SimpleArtistInfo | SpotifyAPI.Artist;

export default Vue.extend({
  components: {
    UserAvatar,
  },

  props: {
    artists: {
      type: Array as PropType<Artist[]>,
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
    avatarSize: {
      type: Number,
      default: 28,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    artistNames(): string {
      return this.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    hasImages(): (artist: Artist) => boolean {
      return (artist: Artist) => {
        if ('images' in artist) {
          return (artist.images?.length ?? 0) > 0;
        }
        return false;
      };
    },
    getImageSrc(): (artist: Artist) => string | undefined {
      return (artist: Artist) => {
        if ('images' in artist) {
          return getImageSrc(artist.images, this.avatarSize);
        }
        return undefined;
      };
    },
    artistPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
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
.Artist {
  display: inline-flex;
  flex-wrap: nowrap;

  &__avatar {
    margin-right: 0.25rem;
  }

  &:not(:first-child) {
    // avatar を表示するときはアーティスト間に空白を入れる
    .Artist__avatar {
      margin-left: 1rem;
    }
  }
}

.inline {
  display: inline;
}
</style>
