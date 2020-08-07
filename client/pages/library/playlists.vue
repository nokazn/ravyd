<template>
  <div :class="$style.LibraryPlaylistsPage">
    <h1 :class="$style.LibraryPlaylistsPage__title">
      {{ title }}
    </h1>

    <div :class="$style.Cards">
      <template v-if="playlists != null">
        <PlaylistCard
          v-for="(playlist, index) in playlists"
          :key="`${playlist.id}-${index}`"
          v-bind="playlist"
          :min-width="180"
          :max-width="240"
          :class="$style.Cards__card"
        />
      </template>

      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { RootState } from 'typed-vuex';

import PlaylistCard from '~/components/containers/card/PlaylistCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

interface Data {
  title: string
}

@Component({
  components: {
    PlaylistCard,
    IntersectionLoadingCircle,
  },
})
export default class LibraryPlaylistPage extends Vue implements Data {
  title = 'フォロー中のプレイリスト';

  head() {
    return {
      title: this.title,
    };
  }

  get playlists(): RootState['playlists']['playlists'] {
    return this.$state().playlists.playlists;
  }

  mounted() {
    this.$dispatch('setDefaultDominantBackgroundColor');
  }
}
</script>

<style lang="scss" module>
.LibraryPlaylistsPage {
  padding: 16px max(12px, 3vw) 48px;

  & > * {
    margin-bottom: 24px;
  }

  .Cards {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    & > * {
      margin-left: 16px;
      margin-right: 16px;
      flex: 1 0 180px;
      min-width: 180px;
      max-width: 240px;
    }

    &__card {
      margin-bottom: 32px;
    }

    &__spacer {
      height: 0;
    }
  }
}
</style>
