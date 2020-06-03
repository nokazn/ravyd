<template>
  <v-card
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
        <nuxt-link
          :key="id"
          :to="`/genres/${id}`"
          v-text="name"
        />
      </div>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

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
