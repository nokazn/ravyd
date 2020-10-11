<template>
  <v-list-item
    dense
    :color="color"
    :nuxt="!isTwoLine"
    :to="isTwoLine ? undefined : to"
    :title="name"
    :data-is-selected="selected"
    :class="$style.ContentListItem"
    @click.native="onClicked"
  >
    <v-list-item-avatar
      tile
      :class="$style.ContentListItem__avatar"
    >
      <UserAvatar
        v-if="type === 'artist'"
        type="artist"
        :src="artworkSrc"
        :alt="name"
        :title="name"
        :size="40"
        default-user-icon="mdi-account-music"
        small-icon
      />
      <ReleaseArtwork
        v-else
        :src="artworkSrc"
        :alt="name"
        :title="name"
        :size="40"
      />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title class="g-ellipsis-text">
        <nuxt-link
          :to="to"
          @click.native.stop
        >
          {{ name }}
        </nuxt-link>
      </v-list-item-title>

      <v-list-item-subtitle v-if="isTwoLine">
        <ArtistNames
          ellipsis
          :artists="artists"
        />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/image/ReleaseArtwork.vue';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { getImageSrc } from '~/utils/image';
import { SpotifyAPI, App } from '~~/types';

const CLICK = 'click';

export type On = {
  [CLICK]: void
}

export default Vue.extend({
  components: {
    ReleaseArtwork,
    UserAvatar,
    ArtistNames,
  },

  props: {
    type: {
      type: String as PropType<SpotifyAPI.SearchType>,
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
    releaseId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: Array as PropType<SpotifyAPI.Image[]>,
      default: undefined,
    },
    artists: {
      type: Array as PropType<App.SimpleArtistInfo[] | undefined>,
      default: undefined,
    },
    to: {
      type: [String, Object] as PropType<string | RawLocation>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  computed: {
    isTwoLine(): boolean {
      return this.artists != null;
    },
    artworkSrc(): string | undefined {
      return getImageSrc(this.images, this.$constant.TRACK_LIST_ARTWORK_SIZE);
    },
  },

  methods: {
    onClicked() {
      if (this.isTwoLine) {
        this.$router.push(this.to);
      }

      this.$emit(CLICK);
    },
  },
});
</script>

<style lang="scss" module>
.ContentListItem {
  &[data-is-selected=true] {
    background-color: lighten($g-menu-background-color, 16%);
  }

  &__avatar {
    margin-top: 6px !important;
    margin-bottom: 6px !important;
  }
}
</style>
