<template>
  <v-text-field
    v-model="query"
    dense
    hide-details
    rounded
    light
    background-color="white"
    :height="height"
    title="検索"
    :class="{
      [$style.SearchField]: true,
      'g-box-shadow': isFocused || isHovered
    }"
    @focus="handleIsFocused(true)"
    @mouseover="handleIsHovered(true)"
    @blur="handleIsFocused(false)"
    @mouseout="handleIsHovered(false)"
    @input="debouncedEmitter"
  >
    <template #prepend-inner>
      <div
        :class="$style.SearchField__prependInnerIcon"
        :style="iconStyles"
      >
        <v-icon
          :size="iconSize"
          color="grey darken-4"
          title="検索"
        >
          mdi-magnify
        </v-icon>
      </div>
    </template>

    <template #append>
      <div
        :class="$style.SearchField__clearIcon"
        :style="iconStyles"
      >
        <v-icon
          v-show="query !== ''"
          :size="iconSize"
          color="grey darken-1"
          title="消去"
          @click="clearText"
        >
          mdi-close
        </v-icon>
      </div>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import { Cancelable } from 'lodash';

import { $searchForm } from '~/observable/searchFormState';

type Data = {
  isHovered: boolean
  iconSize: number
  iconStyles: { height: string }
  debouncedEmitter: ((query: string) => void) & Cancelable
}

const ON_INPUT = 'on-input';

export type On = {
  [ON_INPUT]: string
}

export default Vue.extend({
  props: {
    height: {
      type: Number,
      default: 28,
    },
  },

  data(): Data {
    const interval = 700;
    const debouncedEmitter = debounce((query: string) => {
      if (query) {
        this.$emit(ON_INPUT, query);
      }
    }, interval);

    return {
      isHovered: false,
      iconSize: (this.height * 4) / 5,
      iconStyles: { height: `${this.height}px` },
      debouncedEmitter,
    };
  },

  computed: {
    query: {
      get(): string {
        return $searchForm.query;
      },
      set(query: string) {
        $searchForm.setQuery(query);
      },
    },
    isFocused: {
      get(): boolean {
        return $searchForm.isFocused;
      },
      set(isFocused: boolean) {
        $searchForm.setIsFocused(isFocused);
      },
    },
  },

  methods: {
    clearText() {
      $searchForm.setQuery('');
    },
    handleIsFocused(isFocused: boolean) {
      $searchForm.setIsFocused(isFocused);
    },
    handleIsHovered(isHovered: boolean) {
      this.isHovered = isHovered;
    },
  },
});
</script>

<style lang="scss" module>
.SearchField {
  min-width: 140px;
  max-width: 200px;
  position: relative;
  height: 100%;

  &__prependInnerIcon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: -12px;
  }

  &__clearIcon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: -12px;
  }
}
</style>
