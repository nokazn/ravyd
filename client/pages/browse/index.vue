<template>
  <div :class="$style.BrowsePage">
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>

    <div
      v-if="categoryList != null"
      :class="$style.Cards"
    >
      <CategoryCard
        v-for="category in categoryList"
        :key="category.id"
        v-bind="category"
        :min-size="MIN_IMAGE_SIZE"
        :max-size="MAX_IMAGE_SIZE"
        :class="$style.Cards__card"
      />

      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
      <div :class="$style.Cards__spacer" />
    </div>

    <IntersectionLoadingCircle
      :is-loading="!isFullCategoryList"
      @on-appeared="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import CategoryCard from '~/components/parts/card/CategoryCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import { getCategoryList } from '~/plugins/local/browse';
import { App } from '~~/types';

interface AsyncData {
  isFullCategoryList: boolean
  categoryList: App.CategoryInfo[] | undefined
}

interface Data {
  title: string
  MIN_IMAGE_SIZE: number
  MAX_IMAGE_SIZE: number
}

const MIN_IMAGE_SIZE = 180;
const MAX_IMAGE_SIZE = 240;
const LIMIT_OF_CATEGORIES = 30;

@Component({
  components: {
    CategoryCard,
    IntersectionLoadingCircle,
  },

  async asyncData(context): Promise<AsyncData> {
    const categoryList = await getCategoryList(context);
    const isFullCategoryList = categoryList == null
      || (categoryList != null && categoryList.length < LIMIT_OF_CATEGORIES);

    return {
      isFullCategoryList,
      categoryList,
    };
  },
})
export default class BrowsePage extends Vue implements AsyncData, Data {
  isFullCategoryList = false;
  categoryList: App.CategoryInfo[] | undefined = undefined;

  title = '見つける';
  MIN_IMAGE_SIZE = MIN_IMAGE_SIZE;
  MAX_IMAGE_SIZE = MAX_IMAGE_SIZE;

  head() {
    return {
      title: this.title,
    };
  }

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  async getCategoryList() {
    if (this.isFullCategoryList) return;

    const country = this.$getters()['auth/userCountryCode'];
    const offset = this.categoryList?.length;
    const { categories } = await this.$spotify.browse.getCategoryList({
      country,
      limit: LIMIT_OF_CATEGORIES,
      offset,
    });
    if (categories == null) {
      this.isFullCategoryList = true;
      return;
    }

    const addedCategoryList = categories.items.map((category) => ({
      id: category.id,
      name: category.name,
      artworkList: category.icons,
    }));

    this.categoryList = this.categoryList != null
      ? [...this.categoryList, ...addedCategoryList]
      : addedCategoryList;

    if (categories.next == null) {
      this.isFullCategoryList = true;
    }
  }

  onLoadingCircleAppeared() {
    this.getCategoryList();
  }
}
</script>

<style lang="scss" module>
.BrowsePage {
  padding: 16px max(12px, 4vw) 48px;

  &__title {
    margin-left: 3%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }

  .Cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    & > * {
      margin-left: 16px;
      margin-right: 16px;
      flex: 1 0 180px;
      min-width: 180px;
      max-width: 220px;
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
