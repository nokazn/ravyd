<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="image"
      boilerplate
      :width="size"
      :min-width="size"
      :max-width="maxSize || size"
      :height="size"
      :min-height="size"
      :max-height="maxSize || size"
    />
    <v-card
      v-else
      ripple
      hover
      tile
      nuxt
      :to="`/genres/${id}`"
    >
      <v-img
        :src="src"
        :alt="name"
        :title="name"
        :width="size"
        :max-width="maxSize"
        :aspect-ratio="1"
      >
        <div :class="$style.CategoryImage__link">
          <span
            class="g-ellipsis-text"
            :title="name"
            v-text="name"
          />
        </div>
      </v-img>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

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
    src: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: undefined,
    },
    maxSize: {
      type: Number,
      default: undefined,
    },
  },

  data(): Data {
    return {
      isLoaded: false,
    };
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
