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
import ReleaseCardContainer from '@/components/parts/container/ReleaseCardConteiner.vue';
import ReleaseCard from '@/components/parts/card/ReleaseCard.vue';

export type ReleaseCardInfo = {
  releaseName: string
  artistName: string
  src: string
}

export default Vue.extend({
  components: {
    ReleaseCardContainer,
    ReleaseCard,
  },

  async fetch({ app }) {
    await app.$dispatch('browse/getNewReleases');
  },

  computed: {
    newReleaseList(): ReleaseCardInfo[] {
      const releases = this.$state().browse.newReleases?.items
        .map((album) => ({
          releaseName: album.name,
          artistName: album.artists[0].name,
          src: album.images[0].url,
        }));

      return releases ?? [];
    },
  },
});
</script>

<style lang="scss" module>
.RootPage {
  margin: 16px 32px;
  &__title {
    margin-bottom: 16px;
  }
  &__releaseCardContainer {
    margin: 12px -32px;
  }
}
</style>
