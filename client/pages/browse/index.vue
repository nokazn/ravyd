<template>
  <div :class="$style.BrowsePage">
    <h1 v-text="title" />

    <div
      v-if="categoryList != null"
      :class="$style.BrowsePage__categoryImageContainer"
    >
      <CategoryCard
        v-for="{ id, name, artworkSrc } in categoryList"
        :id="id"
        :key="id"
        :src="artworkSrc"
        :max-size="maxImageSize"
        :name="name"
        :class="$style.BrowsePage__categoryImage"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

import CategoryCard from '~/components/parts/card/CategoryCard.vue';
import { getCategoryList } from '~/scripts/localPlugins/browse';
import { App } from '~~/types';

type AsyncData = {
  maxImageSize: number
  categoryList: App.CategoryInfo[] | undefined
}

type Data = {
  title: string
}

@Component({
  components: {
    CategoryCard,
  },

  async asyncData(context): Promise<AsyncData> {
    const maxImageSize = 220;
    const categoryList = await getCategoryList(context, maxImageSize);

    return {
      maxImageSize,
      categoryList,
    };
  },
})
export default class BrowsePage extends Vue implements Data {
  title = '見つける'

  head() {
    return {
      title: this.title,
    };
  }
}
</script>

<style lang="scss" module>
.BrowsePage {
  padding: 16px 6% 48px;

  & > *:not(:last-child) {
    margin-bottom: 24px;
  }
  &__categoryImageContainer {
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
  &__categoryImage {
    margin-bottom: 32px;
  }
  &__spacer {
    height: 0;
  }
}
</style>
