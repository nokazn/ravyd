<template>
  <div
    :class="{ [$style.inline]: inline }"
    :title="artistNames"
  >
    <template v-if="text">
      <span :title="name">
        {{ artistNames }}
      </span>
    </template>

    <template v-else>
      <template v-for="({ name, id }, index) in artists">
        <nuxt-link
          :key="id"
          :to="artistPath(id)"
          :title="name"
          @click.native.stop="onClicked"
        >
          {{ name }}
        </nuxt-link><span
          v-if="index !== artists.length - 1"
          :key="`${id}-comma`"
        >, </span>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import { hasProp } from '~~/utils/hasProp';
import { App } from '~~/types';

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  props: {
    artists: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    text: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    artistNames(): string {
      return this.artists
        .map((artist) => artist.name)
        .join(', ');
    },
    artistPath(): (id: string) => string {
      return (id: string) => `/artists/${id}`;
    },
  },

  methods: {
    onClicked() {
      this.$emit(ON_CLICKED);
    },
  },
});
</script>

<style lang="scss" module>
.inline {
  display: inline;
}
</style>
