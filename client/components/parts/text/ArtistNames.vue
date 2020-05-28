<template>
  <div :class="$style.ArtistNames">
    <template
      v-for="({ name, id }, index) in artistList"
    >
      <nuxt-link
        :key="id"
        :to="artistPath(id)"
      >
        {{ name }}
      </nuxt-link><span
        v-if="index !== artistList.length - 1"
        :key="`${id}-comma`"
        :class="$style.ArtistNames__comma"
      >, </span>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { hasProp } from '~~/utils/hasProp';
import { App } from '~~/types';

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
  },

  computed: {
    artistPath(): (id: string) => string {
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
  &__comma {
    margin-right: .5em;
  }
}
</style>
