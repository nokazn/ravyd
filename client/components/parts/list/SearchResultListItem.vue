<template>
  <v-list-item
    dense
    :nuxt="!isTwoLine"
    :to="isTwoLine ? undefined : to"
    :two-line="isTwoLine"
    :title="name"
    @click.native="onClicked"
  >
    <v-list-item-avatar tile>
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

import ReleaseArtwork from '~/components/parts/avatar/ReleaseArtwork.vue';
import UserAvatar from '~/components/parts/avatar/UserAvatar.vue';
import ArtistNames from '~/components/parts/text/ArtistNames.vue';
import { SpotifyAPI, App } from '~~/types';

type Data = {
  to: string
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
    hash: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const type = ({
      album: 'releases',
      artist: 'artists',
      track: 'releases',
      playlist: 'playlists',
      show: 'episodes',
      episode: 'episodes',
    } as const)[this.type];
    const to = this.hash != null
      ? `/${type}/${this.releaseId}#${this.hash}`
      : `/${type}/${this.releaseId}`;

    const isTwoLine = this.artistList != null;

    return {
      to,
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
