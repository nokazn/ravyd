<template>
  <div :class="$style.ArtistName">
    <template
      v-for="({ name, id }, index) in artistList">
      <nuxt-link
        :key="id"
        :to="artistsPath(id)">
        {{ name }}
      </nuxt-link>

      <span
        v-if="index !== artistList.length - 1"
        :key="`${id}-comma`">, </span>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { hasProp } from '@/utils/hasProp';

export type Artists = {
  name: string
  id: string
}[]

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<Artists>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
  },

  computed: {
    artistsPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
  },
});
</script>

<style lang="scss" module>
.ArtistName {
  color: $g-subtitle-color;
  font-size: 0.7rem;
  padding: 0 8px 4px;
  line-height: 1rem;
}
</style>
