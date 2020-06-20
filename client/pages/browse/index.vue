<template>
  <div :class="$style.BrowsePage">
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>

    <div
      v-if="categoryList != null"
      :class="$style.BrowsePage__categoryCardContainer"
    >
      <CategoryCard
        v-for="{ id, name, artworkSrc } in categoryList"
        :id="id"
        :key="id"
        :src="artworkSrc"
        :min-size="MIN_IMAGE_SIZE"
        :max-size="MAX_IMAGE_SIZE"
        :name="name"
        :class="$style.BrowsePage__categoryCard"
      />

      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
      <div :class="$style.BrowsePage__spacer" />
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
import { getCategoryList } from '~/scripts/localPlugins/browse';
import { getImageSrc } from '~/scripts/converter/getImageSrc';
import { App } from '~~/types';

interface AsyncData {
  MIN_IMAGE_SIZE: number
  MAX_IMAGE_SIZE: number
  isFullCategoryList: boolean
  categoryList: App.CategoryInfo[] | null
}

interface Data {
  title: string
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
    const categoryList = await getCategoryList(context, MAX_IMAGE_SIZE);
    const isFullCategoryList = categoryList == null
      || (categoryList != null && categoryList.length < LIMIT_OF_CATEGORIES);

    return {
      MIN_IMAGE_SIZE,
      MAX_IMAGE_SIZE,
      isFullCategoryList,
      categoryList,
    };
  },
})
export default class BrowsePage extends Vue implements AsyncData, Data {
  MIN_IMAGE_SIZE = MIN_IMAGE_SIZE;
  MAX_IMAGE_SIZE = MAX_IMAGE_SIZE;
  isFullCategoryList = false;
  categoryList: App.CategoryInfo[] | null = null;

  title = '見つける';

  head() {
    return {
      title: this.title,
    };
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
      artworkSrc: getImageSrc(category.icons, this.MAX_IMAGE_SIZE),
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
  padding: 16px 3% 48px;

  &__title {
    margin-left: 3%;
  }

  &__categoryCardContainer {
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
  }

  &__categoryCard {
    margin-bottom: 32px;
  }

  &__spacer {
    height: 0;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
