<template>
  <v-text-field
    ref="SEARCH_FIELD_REF"
    dense
    hide-details
    rounded
    light
    background-color="white"
    placeholder="検索"
    title="検索"
    autocomplete="off"
    aria-autocomplete="none"
    :height="32"
    :value="query"
    :class="{
      [$style.SearchField]: true,
      'g-box-shadow': isFocused || isHovered
    }"
    @input="debouncedDispatcher"
    @mouseover="toggleIsHovered(true)"
    @mouseout="toggleIsHovered(false)"
    @focus="toggleIsFocused(true)"
    @blur="toggleIsFocused(false)"
  >
    <template #prepend-inner>
      <div :class="$style.SearchField__prependInnerIcon">
        <v-icon
          :size="28"
          color="grey darken-4"
          title="検索"
        >
          mdi-magnify
        </v-icon>
      </div>
    </template>

    <template #append>
      <div :class="$style.SearchField__clearIcon">
        <v-btn
          v-show="query !== ''"
          icon
          small
          title="消去"
          @click="clearText"
        >
          <v-icon
            :size="24"
            color="grey"
          >
            mdi-close
          </v-icon>
        </v-btn>
      </div>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref, computed } from '@vue/composition-api';
import { debounce } from 'lodash';
import { useTextField } from '~/use/keyboard';

const LIMIT_OF_SEARCH_ITEM = 4;
const UPDATE_QUERY = 'update:query';
const UPDATE_MENU = 'update:menu';
const UPDATE_SEARCHING = 'update:searching';

export default defineComponent({
  props: {
    query: {
      type: String,
      required: true,
    },
    menu: {
      type: Boolean,
      required: true,
    },
    searching: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { root, emit }) {
    const isFocused = ref(false);
    const isHovered = ref(false);
    const SEARCH_FIELD_REF = ref<Vue>();

    const queryRef = computed<string>({
      get() { return props.query; },
      set(q) { emit(UPDATE_QUERY, q); },
    });
    const menuRef = computed<boolean>({
      get() { return props.menu; },
      set(v) { emit(UPDATE_MENU, v); },
    });
    const searchingRef = computed<boolean>({
      get() { return props.searching; },
      set(v) { emit(UPDATE_SEARCHING, v); },
    });

    const debouncedDispatcher = debounce((q: string) => {
      queryRef.value = q;
      if (q) {
        searchingRef.value = true;
        root.$dispatch('search/searchAllItems', {
          // @todo スペースをアンダーバーに置換して1単語として扱う
          query: q.replace(/\s+/g, '_'),
          limit: LIMIT_OF_SEARCH_ITEM,
        }).then(() => {
          searchingRef.value = false;
        });
      }
    }, 500);

    const toggleIsFocused = (focus: boolean) => {
      isFocused.value = focus;
      menuRef.value = focus;
    };
    const toggleIsHovered = (hover: boolean) => { isHovered.value = hover; };
    const clearText = () => { queryRef.value = ''; };

    useTextField(root, 'SEARCH_FIELD', SEARCH_FIELD_REF);

    return {
      isFocused,
      isHovered,
      debouncedDispatcher,
      queryRef,
      menuRef,
      SEARCH_FIELD_REF,
      toggleIsFocused,
      toggleIsHovered,
      clearText,
    };
  },
});
</script>

<style lang="scss" module>
.SearchField {
  width: 240px;

  &__prependInnerIcon {
    display: inline-flex;
    align-items: center;
    height: 32px;
    margin-left: -12px;
  }

  &__clearIcon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    height: 32px;
    margin-right: -12px;
  }
}
</style>
