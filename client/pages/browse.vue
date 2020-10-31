<template>
  <div :class="$style.BrowsePage">
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>
    <Tabs
      divider
      :items="tabs"
      :class="$style.BrowsePage__tabs"
    />
    <nuxt-child keep-alive />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import Tabs, { Item } from '~/components/parts/tab/Tabs.vue';

interface Data {
  tabs: readonly Item[];
  title: string;
}

@Component({
  components: {
    Tabs,
  },
})
export default class BrowsePage extends Vue implements Data {
  tab: number | null = null;
  tabs: readonly Item[] = [
    {
      title: 'ジャンル',
      to: '/browse/categories',
    },
    {
      title: '特集',
      to: '/browse/feature',
    },
  ];
  title = '見つける';

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
    this.$header.toggleBackdropFilter(false);
  }

  destroyed() {
    this.$header.toggleBackdropFilter(true);
  }

  head() {
    return {
      title: this.title,
    };
  }
}
</script>

<style lang="scss" module>
.BrowsePage {
  @include page-margin();

  &__title {
    margin-left: 2%;
    margin-bottom: 8px;
  }

  &__tabs {
    position: sticky;
    top: $g-header-height;
    margin-bottom: 24px;
    z-index: z-index-of(tab);
  }
}
</style>
