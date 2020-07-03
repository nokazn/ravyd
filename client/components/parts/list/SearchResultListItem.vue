<template>
  <v-list-item
    dense
    :nuxt="!isTwoLine"
    :to="isTwoLine ? undefined : to"
    two-line
    :title="name"
    :data-is-selected="isSelected"
    :class="$style.SearchResultListItem"
    @click.native="onClicked"
  >
    <v-list-item-avatar
      tile
      :class="$style.SearchResultListItem__avatar"
    >
      <UserAvatar
        v-if="type === 'artist'"
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
          :artist-list="artistList"
          class="g-ellipsis-text"
        />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RawLocation } from 'vue-router';

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { SpotifyAPI, App } from '~~/types';

type Data = {
  isTwoLine: boolean
}

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
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
    artworkSrc: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[] | undefined>,
      default: undefined,
    },
    to: {
      type: [String, Object] as PropType<string | RawLocation>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    const isTwoLine = this.artistList != null;

    return {
      isTwoLine,
    };
  },

  methods: {
    onClicked() {
      if (this.isTwoLine) {
        this.$router.push(this.to);
      }

      this.$emit(ON_CLICKED);
    },
  },
});
</script>

<style lang="scss" module>
.SearchResultListItem {
  &[data-is-selected=true] {
    background-color: lighten($g-menu-background-color, 15%);
  }

  &__avatar {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
  }
}
</style>
