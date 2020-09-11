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
      :to="genrePath"
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
        <div :class="$style.CategoryImage__link">
          <span
            class="g-ellipsis-text"
            :title="name"
          >
            {{ name }}
          </span>
        </div>
      </v-img>

      <v-sheet
        v-else
        :title="name"
        :min-width="minSize || size"
        :min-height="minSize || size"
        :width="size"
        :height="size"
        :max-width="maxSize || size"
        :max-height="maxSize || size"
      >
        <div :class="$style.CategoryImage__link">
          <span
            class="g-ellipsis-text"
            :title="name"
          >
            {{ name }}
          </span>
        </div>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { getImageSrc } from '~/utils/image/getImageSrc';
import { SpotifyAPI } from '~~/types';

export type Data = {
  isLoaded: boolean
}

export default Vue.extend({
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

  data(): Data {
    return {
      isLoaded: false,
    };
  },

  computed: {
    artworkSrc(): string | undefined {
      return getImageSrc(this.images, this.maxSize ?? this.size);
    },
    genrePath(): string {
      return `/genres/${this.id}`;
    },
  },

  mounted() {
    this.isLoaded = true;
  },
});
</script>

<style lang="scss" module>
.CategoryImage {
  &__link {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 80%;
  }
}
</style>
