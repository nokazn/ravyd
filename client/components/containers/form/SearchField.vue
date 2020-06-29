<template>
  <v-text-field
    v-model="text"
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
    @input="debouncer"
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
          v-show="text !== ''"
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
import { SpotifyAPI } from '~~/types';

export type Data = {
  text: string
  result: SpotifyAPI.SearchResult
  isFocused: boolean
  isHovered: boolean
  iconSize: number
  iconStyles: { height: string }
  debouncer: ((query: string) => Promise<void>) & Cancelable
}

export default Vue.extend({
  props: {
    height: {
      type: Number,
      default: 28,
    },
  },

  data(): Data {
    const interval = 1000;
    const debouncer = debounce(async (query: string) => {
      if (!query) return;

      const res = await this.$spotify.search.searchItems({
        query,
        typeList: ['album'],
      });

      console.log(res);
    }, interval);

    return {
      text: '',
      result: {},
      isFocused: false,
      isHovered: false,
      iconSize: (this.height * 4) / 5,
      iconStyles: { height: `${this.height}px` },
      debouncer,
    };
  },

  computed: {
  },

  methods: {
    clearText() {
      this.text = '';
    },
    handleIsFocused(isFocused: boolean) {
      this.isFocused = isFocused;
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
