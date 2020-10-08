<template>
  <div :class="$style.LibraryPage">
    <h1 :class="$style.LibraryPage__title">
      ライブラリ
    </h1>

    <div :class="$style.LibraryPage__tabs">
      <client-only>
        <v-tabs
          v-model="tab"
          show-arrows="mobile"
          color="active"
          :background-color="$constant.BACKGROUND_COLOR"
        >
          <v-tab
            v-for="item in tabItemList"
            :key="item.title"
            nuxt
            :to="item.to"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>

        <v-divider />
      </client-only>
    </div>

    <nuxt-child />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

type TabItem = {
  title: string
  to: string
}

type Data = {
  tab: number | null;
  tabItemList: TabItem[]
}

@Component({
  scrollToTop: true,
})
export default class LibraryPage extends Vue implements Data {
  tab: number | null = null;
  tabItemList: TabItem[] = [
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
  @include page-margin;

  &__title {
    margin-bottom: 8px;
    margin-left: 1vw;
  }

  &__tabs {
    position: sticky;
    top: $g-header-height;
    z-index: z-index-of(tab);
    margin-bottom: 24px;
  }
}
</style>
