<template>
  <div :class="$style.BrowsePage">
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>

    <div :class="$style.BrowsePage__tabs">
      <client-only>
        <v-tabs
          v-model="tab"
          color="active"
          :height="32"
          :show-arrows="false"
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

    <nuxt-child keep-alive />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import CategoryCard from '~/components/parts/card/CategoryCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';

type TabItem = {
  title: string;
  to: string;
}

interface Data {
  title: string;
}

@Component({
  components: {
    CardsWrapper,
    CategoryCard,
    IntersectionLoadingCircle,
    Fallback,
  },
})
export default class BrowsePage extends Vue implements Data {
  tab: number | null = null;
  tabItemList: readonly TabItem[] = [
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
