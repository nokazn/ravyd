<template>
  <main :class="$style.RootPage">
    <section :class="$style.RootPage__section">
      <h2 :class="$style.RootPage__title">
        今週の新譜
      </h2>
      <release-card-container :class="$style.RootPage__releaseCardContainer">
        <release-card
          v-for="release in newReleaseList"
          :key="release.name"
          v-bind="release" />
      </release-card-container>
    </section>

    <section :class="$style.RootPage__section">
      <h2>お気に入りのトラック</h2>
      <release-card-container :class="$style.RootPage__releaseCardContainer">
        <release-card
          v-for="track in topTrackList"
          :key="track.name"
          v-bind="track" />
      </release-card-container>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import ReleaseCardContainer from '~/components/parts/container/ReleaseCardConteiner.vue';
import ReleaseCard, { ReleaseCardInfo } from '~/components/containers/card/ReleaseCard.vue';
import { SpotifyAPI } from '~~/types';

export type AsyncData = {
  topArtistList: any,
  topTrackList: ReleaseCardInfo[] | null
}

export default Vue.extend({
  components: {
    ReleaseCardContainer,
    ReleaseCard,
  },

  async fetch({ app }) {
    await Promise.all([
      app.$dispatch('browse/getNewReleases'),
    ]);
    const data = await app.$spotifyApi.$get('/me/top/artists');
    console.log(data);
  },

  async asyncData({ app }): Promise<AsyncData> {
    const [topArtists, topTracks]: [
      SpotifyAPI.Browse.TopArtists | null,
      SpotifyAPI.Browse.TopTracks | null,
    ] = await Promise.all([
      app.$spotifyApi.$get('/me/top/artists')
        .catch((err: Error) => {
          console.error({ err });
          return null;
        }),
      app.$spotifyApi.$get('/me/top/tracks')
        .catch((err: Error) => {
          console.error({ err });
          return null;
        }),
    ]);

    const topArtistList: {
      name: string
      id: string
      src: string
    }[] | null = topArtists != null
      ? topArtists.items.map((artist) => ({
        name: artist.name,
        id: artist.id,
        src: artist.images[0].url,
      }))
      : null;
    const topTrackList: ReleaseCardInfo[] | null = topTracks != null
      ? topTracks.items.map((track) => ({
        type: track.type,
        name: track.name,
        id: track.id,
        releaseId: track.album.id,
        uri: track.uri,
        artists: track.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
        src: track.album.images[0].url,
      }))
      : null;

    return {
      topArtistList,
      topTrackList,
    };
  },

  computed: {
    newReleaseList(): ReleaseCardInfo[] {
      const newReleaseList: ReleaseCardInfo[] | undefined = this.$state().browse.newReleases?.items
        .map((album) => ({
          type: album.type,
          name: album.name,
          id: album.id,
          releaseId: album.id,
          uri: album.uri,
          artists: album.artists,
          src: album.images[0].url,
        }));

      return newReleaseList ?? [];
    },
  },
});
</script>

<style lang="scss" module>
.RootPage {
  margin: 32px;
  &__section:not(:last-child) {
    margin-bottom: 32px;
  }
  &__title {
    margin-bottom: 16px;
  }
  // .RootPage の margin を打ち消す
  &__releaseCardContainer {
    margin: 12px -32px;
  }
}
</style>
