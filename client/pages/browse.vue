<template>
  <div :class="$style.BrowsePage">
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>

    <CardsWrapper
      v-if="categoryList != null"
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <CategoryCard
        v-for="category in categoryList"
        :key="category.id"
        v-bind="category"
        :min-size="$screen.cardWidthMinMax[0]"
        :max-size="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>

    <IntersectionLoadingCircle
      :loading="!isFullCategoryList"
      @appear="onLoadingCircleAppeared"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import CategoryCard from '~/components/parts/card/CategoryCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';

import { getCategoryList } from '~/services/local/browse';
import { App } from '~~/types';

interface AsyncData {
  isFullCategoryList: boolean
  categoryList: App.CategoryInfo[] | undefined
}

interface Data {
  title: string
}

const LIMIT_OF_CATEGORIES = 30;

@Component({
  components: {
    CardsWrapper,
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
      images: category.icons,
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
  @include page-margin();

  &__title {
    margin-left: 3%;
  }

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
}
</style>
