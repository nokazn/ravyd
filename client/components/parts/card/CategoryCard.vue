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
        :alt="name"
        :title="name"
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
            :title="name"
          >
            {{ name }}
          </span>
        </div>
      </v-img>

      <div
        v-else
        :class="$style.Ratio"
      >
        <svg viewBox="0 0 1 1" />
        <v-sheet
          :title="name"
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
              :title="name"
            >
              {{ name }}
            </span>
          </div>
        </v-sheet>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  PropType,
} from '@vue/composition-api';

import { getImageSrc } from '~/utils/image';
import { SpotifyAPI } from '~~/types';

type Data = {
  isLoaded: boolean
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: Array as PropType<SpotifyAPI.Image[]>,
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
    const isLoaded = ref(false);
    const artworkSrc = computed(() => getImageSrc(
      props.images,
      props.maxSize ?? props.size,
    ));
    const categoryPath = computed(() => `/categories/${props.id}`);
    onMounted(() => { isLoaded.value = true; });

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
  display: grid;

  & > * {
    grid-area: 1 / 1 / -1 / -1;
  }
}
</style>
