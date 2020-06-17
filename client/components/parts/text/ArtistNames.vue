<template>
  <div
    :class="{
      [$style.ArtistNames]: true,
      [$style.inline]: inline,
    }"
  >
    <template
      v-for="({ name, id }, index) in artistList"
    >
      <nuxt-link
        :key="id"
        :to="artistPath(id)"
        :title="name"
        @click.native.stop="onClicked"
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

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  props: {
    artistList: {
      type: Array as PropType<App.SimpleArtistInfo[]>,
      required: true,
      validator(value) {
        return value.every((ele) => hasProp(ele, ['name', 'id']));
      },
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
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
.ArtistNames {
  white-space: nowrap;

  & > * {
    display: inline-block;
  }

  &__comma {
    margin-right: 0.5em;
  }
}

.inline {
  display: inline;
}
</style>
