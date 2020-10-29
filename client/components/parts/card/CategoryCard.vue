<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="image"
      boilerplate
      :min-width="minSize || size"
      :min-height="minSize || size"
      :width="size"
      :height="size"
      :max-width="maxSize || size"
      :max-height="maxSize || size"
    />
    <v-card
      v-else
      ripple
      hover
      tile
      nuxt
      :to="categoryPath"
    >
      <v-img
        v-if="artworkSrc != null"
        :src="artworkSrc"
        :alt="item.name"
        :title="item.name"
        :min-width="minSize || size"
        :min-height="minSize || size"
        :width="size"
        :height="size"
        :max-width="maxSize || size"
        :max-height="maxSize || size"
        :aspect-ratio="1"
      >
        <div :class="$style.CategoryCard__link">
          <span
            class="g-ellipsis-text"
            :title="item.name"
          >
            {{ item.name }}
          </span>
        </div>
      </v-img>

      <div
        v-else
        :class="$style.Ratio"
      >
        <svg
          v-if="size == null"
          viewBox="0 0 1 1"
        />
        <v-sheet
          :title="item.name"
          :min-width="minSize || size"
          :min-height="minSize || size"
          :width="size"
          :height="size"
          :max-width="maxSize || size"
          :max-height="maxSize || size"
        >
          <div :class="$style.CategoryCard__link">
            <span
              class="g-ellipsis-text"
              :title="item.name"
            >
              {{ item.name }}
            </span>
          </div>
        </v-sheet>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

import { getImageSrc } from '~/services/converter';
import { useIsLoaded } from '~/use/util';
import { SpotifyAPI } from '~~/types';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<SpotifyAPI.Category>,
      required: true,
    },
    size: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    minSize: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    maxSize: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
  },

  setup(props) {
    const isLoaded = useIsLoaded();
    const artworkSrc = computed(() => getImageSrc(
      props.item.icons,
      props.maxSize ?? props.size,
    ));
    const categoryPath = computed(() => `/categories/${props.item.id}`);

    return {
      isLoaded,
      artworkSrc,
      categoryPath,
    };
  },
});
</script>

<style lang="scss" module>
.CategoryCard {
  &__link {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 80%;
  }
}

.Ratio {
  display: inline-grid;

  & > * {
    grid-area: 1 / 1;
  }
}
</style>
