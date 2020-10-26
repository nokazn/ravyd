<template>
  <div
    v-if="categories != null"
    :class="$style.BrowsePage"
  >
    <h1 :class="$style.BrowsePage__title">
      {{ title }}
    </h1>

    <CardsWrapper
      v-if="categories != null"
      :min-width="$screen.cardWidthMinMax[0]"
      :max-width="$screen.cardWidthMinMax[1]"
    >
      <CategoryCard
        v-for="category in categories.items"
        :key="category.id"
        :item="category"
        :min-size="$screen.cardWidthMinMax[0]"
        :max-size="$screen.cardWidthMinMax[1]"
      />
    </CardsWrapper>

    <IntersectionLoadingCircle
      :loading="categories.hasNext"
      @appear="onLoadingCircleAppeared"
    />
  </div>

  <Fallback v-else>
    カテゴリーの情報が取得できませんでした。
  </Fallback>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import CardsWrapper from '~/components/parts/wrapper/CardsWrapper.vue';
import CategoryCard from '~/components/parts/card/CategoryCard.vue';
import IntersectionLoadingCircle from '~/components/parts/progress/IntersectionLoadingCircle.vue';
import Fallback from '~/components/parts/others/Fallback.vue';
import { getCategories, Categories } from '~/services/local/browse';

interface AsyncData {
  categories: Categories | undefined;
}

interface Data {
  title: string;
}

const LIMIT_OF_CATEGORIES = 30;

@Component({
  components: {
    CardsWrapper,
    CategoryCard,
    IntersectionLoadingCircle,
    Fallback,
  },

  async asyncData(context): Promise<AsyncData> {
    const categories = await getCategories(context);
    return { categories };
  },
})
export default class BrowsePage extends Vue implements AsyncData, Data {
  categories: Categories | undefined = undefined;
  title = '見つける';

  mounted() {
    this.$dispatch('resetDominantBackgroundColor');
  }

  head() {
    return {
      title: this.title,
    };
  }

  async getCategories() {
    if (this.categories == null || !this.categories.hasNext) return;

    const currentCategories = this.categories;
    const country = this.$getters()['auth/userCountryCode'];
    const offset = this.categories.items.length;
    const { categories } = await this.$spotify.browse.getCategories({
      country,
      limit: LIMIT_OF_CATEGORIES,
      offset,
    });
    if (categories == null) {
      this.categories = {
        ...currentCategories,
        hasNext: false,
      };
      return;
    }

    this.categories = {
      ...currentCategories,
      items: [...currentCategories.items, ...categories.items],
      hasNext: categories.next != null,
    };
  }

  onLoadingCircleAppeared() {
    this.getCategories();
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
