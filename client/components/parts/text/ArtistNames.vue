<template>
  <div :class="$style.ArtistNames">
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
import { hasProp } from '~~/utils/hasProp';

export type Artists = {
  name: string
  id: string
}[]

export type Data = {
  isHovered: boolean
}

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

  data(): Data {
    return {
      isHovered: false,
    };
  },

  computed: {
    artistsPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
  },
});
</script>

<style lang="scss" module>
.ArtistNames {
  white-space: nowrap;
  & > * {
    display: inline-block;
  }
}
</style>
