<template>
  <div :class="$style.LibraryPage">
    <h1 :class="$style.LibraryPage__title">
      ライブラリ
    </h1>
    <Tabs
      :items="tabs"
      divider
      :class="$style.LibraryPage__tabs"
    />
    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Tabs, { Item } from '~/components/parts/tab/Tabs.vue';


type Data = {
  tabs: Item[];
}

@Component({
  components: {
    Tabs,
  },

  scrollToTop: true,
})
export default class LibraryPage extends Vue implements Data {
  tabs: Item[] = [
    {
      title: 'お気に入りの曲',
      to: '/library/tracks',
    },
    {
      title: 'プレイリスト',
      to: '/library/playlists',
    },
    {
      title: 'アルバム',
      to: '/library/releases',
    },
    {
      title: 'アーティスト',
      to: '/library/artists',
    },
    {
      title: 'ポッドキャスト',
      to: '/library/shows',
    },
    {
      title: '最近再生した項目',
      to: '/library/history',
    },
  ];

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
    this.$header.toggleBackdropFilter(false);
  }

  destroyed() {
    this.$header.toggleBackdropFilter(true);
  }
}
</script>

<style lang="scss" module>
.LibraryPage {
  @include page-margin();

  &__title {
    margin-bottom: 8px;
    margin-left: 1vw;
  }

  &__tabs {
    position: sticky;
    top: $g-header-height;
    margin-bottom: 24px;
    z-index: z-index-of(tab);
  }
}
</style>
