<template>
  <div
    :title="artistNames"
    :class="{
      [$style.inline]: inline,
      'g-ellipsis-text': ellipsis,
    }"
  >
    <span
      v-if="text"
      :title="artistNames"
    >
      {{ artistNames }}
    </span>

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
            :src="imageSrc(artist)"
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
          @click.native.stop="onClick"
        >
          {{ artist.name }}
        </nuxt-link>
        <span v-if="!avatar && index !== artists.length - 1">,&nbsp;</span>
      </span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import { getImageSrc } from '~/utils/image';
import type { App, SpotifyAPI } from '~~/types';

const CLICK = 'click';

export type On = {
  [CLICK]: void;
}

type Artist = App.MinimumArtist | SpotifyAPI.Artist;

export default defineComponent({
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
    ellipsis: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const artistNames = computed(() => props.artists
      .map((artist) => artist.name)
      .join(', '));
    const hasImages = (artist: Artist) => {
      return 'images' in artist
        ? (artist.images?.length ?? 0) > 0
        : false;
    };
    const imageSrc = (artist: Artist): string | undefined => {
      return 'images' in artist
        ? getImageSrc(artist.images, props.avatarSize)
        : undefined;
    };
    const artistPath = (id: string) => `/artists/${id}`;
    const hasMultipleArtists = computed(() => props.artists.length > 1);
    const onClick = () => { emit(CLICK); };

    return {
      artistNames,
      hasImages,
      imageSrc,
      artistPath,
      hasMultipleArtists,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.Artist {
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
