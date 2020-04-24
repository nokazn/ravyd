<template>
  <main :class="$style.RootPage">
    <h2 :class="$style.RootPage__title">
      今週の新譜
    </h2>
    <release-card-container :class="$style.RootPage__releaseCardContainer">
      <release-card
        v-for="release in newReleaseList"
        :key="release.name"
        v-bind="release" />
    </release-card-container>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import ReleaseCardContainer from '~/components/parts/container/ReleaseCardConteiner.vue';
import ReleaseCard, { ReleaseCardInfo } from '~/components/parts/card/ReleaseCard.vue';

export default Vue.extend({
  components: {
    ReleaseCardContainer,
    ReleaseCard,
  },

  async fetch({ app }) {
    await Promise.all([
      app.$dispatch('browse/getNewReleases'),
      app.$dispatch('player/getCurrentlyPlayingTrack'),
    ]);
  },

  computed: {
    newReleaseList(): ReleaseCardInfo[] {
      const releases = this.$state().browse.newReleases?.items
        .map((album) => ({
          releaseName: album.name,
          releaseId: album.id,
          artists: album.artists,
          src: album.images[0].url,
        }));

      return releases ?? [];
    },
  },

  mounted() {
    this.$dispatch('player/initPlayer');
  },
});
</script>

<style lang="scss" module>
.RootPage {
  margin: 16px 32px;
  &__title {
    margin-bottom: 16px;
  }
  // .RootPage の margin を打ち消す
  &__releaseCardContainer {
    margin: 12px -32px;
  }
}
</style>
