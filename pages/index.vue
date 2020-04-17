<template>
  <main :class="$style.RootPage">
    <h2 :class="$style.RootPage__title">
      今週の新譜
    </h2>
    <div :class="$style.RootPage__releaseCardContainer">
      <release-card
        v-for="release in newReleaseList"
        :key="release.name"
        v-bind="release" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import ReleaseCard from '@/components/parts/card/ReleaseCard.vue';

export type ReleaseCardInfo = {
  releaseName: string
  artistName: string
  src: string
}

export default Vue.extend({
  components: {
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
    display: flex;
    overflow-x: auto;
    margin: 12px -32px;
    & > *:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>
