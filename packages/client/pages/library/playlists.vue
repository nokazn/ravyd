<template>
  <div :class="$style.LibraryPlaylistsPage">
    <CardsWrapper
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="(playlist, index) in playlists"
        :key="`${playlist.id}-${index}`"
        :item="playlist"
        :min-width="$screen.cardWidthMinMax[0]"
        :max-width="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import type { SpotifyAPI } from 'shared/types';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {}

@Component({
  components: {
    CardsWrapper,
    PlaylistCard,
    IntersectionLoadingCircle,
  },

  head() {
    return {
      title: 'フォロー中のプレイリスト',
    };
  },
})
export default class LibraryPlaylistPage extends Vue implements Data {
  get playlists(): SpotifyAPI.SimplePlaylist[] {
    return this.$getters()['playlists/playlists'] ?? [];
  }
}
</script>

<style lang="scss" module>
.LibraryPlaylistsPage {
  & > * {
    margin-bottom: 24px;
  }
}
</style>
