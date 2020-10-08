<template>
  <div :class="$style.LibraryPlaylistsPage">
    <CardsWrapper
      :min-width="$window.cardWidthMinMax[0]"
      :max-width="$window.cardWidthMinMax[1]"
    >
      <PlaylistCard
        v-for="(playlist, index) in playlists"
        :key="`${playlist.id}-${index}`"
        v-bind="convertPlaylistForCard(playlist)"
        :min-width="$window.cardWidthMinMax[0]"
        :max-width="$window.cardWidthMinMax[1]"
      />
    </CardsWrapper>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { convertPlaylistForCard } from '~/utils/converter';
import { SpotifyAPI } from '~~/types';

interface Data {
  convertPlaylistForCard: typeof convertPlaylistForCard
}

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
  convertPlaylistForCard = convertPlaylistForCard;

  get playlists(): SpotifyAPI.SimplePlaylist[] {
    return this.$state().playlists.playlists ?? [];
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
