<template>
  <portal :to="SEARCH_FORM_PORTAL_NAME">
    <transition name="fade">
      <div
        v-show="menuRef && queryRef"
        :style="styles"
        :class="$style.SearchResultList"
      >
        <v-card rounded="lg">
          <v-list
            dense
            nav
            subheader
            :elevation="12"
            :color="$constant.MENU_BACKGROUND_COLOR"
          >
            <div
              v-show="searchingRef"
              :class="$style['SearchResultList__content--searching']"
            >
              <v-progress-circular indeterminate />
            </div>

            <div
              v-show="!searchingRef && !hasItem"
              :class="$style['SearchResultList__content--empty']"
            >
              <v-icon left>
                mdi-alert-circle-outline
              </v-icon>
              "{{ queryRef }}" に一致する項目が見つかりません
            </div>

            <div
              v-show="!searchingRef && hasItem"
              class="g-custom-scroll-bar"
              :class="$style.SearchResultList__content"
            >
              <template v-for="{ title, items } in itemMapList">
                <div
                  v-if="items.length > 0"
                  :key="title"
                  :class="$style.SearchResultList__group"
                >
                  <v-subheader>
                    {{ title }}
                  </v-subheader>
                  <v-divider />
                  <v-list-item-group>
                    <ContentListItem
                      v-for="item in items"
                      :key="item.id"
                      :item="item"
                      :selected="isSelected(item.id)"
                    />
                  </v-list-item-group>
                </div>
              </template>
            </div>

            <v-divider />

            <div :class="$style.SearchResultList__moreButton">
              <v-btn
                rounded
                text
                small
                nuxt
                to="/search"
                class="g-no-text-decoration"
              >
                <v-icon
                  left
                  small
                >
                  mdi-magnify
                </v-icon>
                もっと見る
              </v-btn>
            </div>
          </v-list>
        </v-card>
      </div>
    </transition>
  </portal>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import ContentListItem from '~/components/parts/list/ContentListItem.vue';
import { $searchForm } from '~/observable/searchForm';
import { useSearchResult } from '~/use/keyboard';
import { useContentPosition } from '~/use/style';

const UPDATE_MENU = 'update:menu';
const UPDATE_SEARCHING = 'update:searching';

export default defineComponent({
  components: {
    ContentListItem,
  },

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
    const queryRef = computed(() => props.query);
    const menuRef = computed<boolean>({
      get() { return props.menu; },
      set(v) { emit(UPDATE_MENU, v); },
    });
    const searchingRef = computed<boolean>({
      get() { return props.searching; },
      set(v) { emit(UPDATE_SEARCHING, v); },
    });

    const {
      itemMapList,
      hasItem,
      selectedItemIndex,
      selectedItem,
      isSelected,
    } = useSearchResult(root, queryRef, menuRef);
    const styles = useContentPosition(root);

    return {
      selectedItemIndex,
      queryRef,
      menuRef,
      searchingRef,
      itemMapList,
      selectedItem,
      hasItem,
      isSelected,
      styles,
      SEARCH_FORM_PORTAL_NAME: $searchForm.PORTAL_NAME,
    };
  },
});
</script>

<style lang="scss" module>
.SearchResultList {
  $content-side-padding: 12px;
  $content-width: 90vw;
  $content-max-width: 1200px;
  $card-footer-height: 48px;

  min-width: min(87.5vw, 400px);
  margin: -4px 4% 0;
  z-index: z-index-of(front-menu);

  &__content {
    overflow-y: auto;
    padding: 0 $content-side-padding;

    @include smaller-than-lg() {
      $footer-height: $g-navigation-bar-height + $g-footer-height-mobile;
      $extra-height: $g-header-height + $card-footer-height + $footer-height;

      max-width: $content-width;
      max-height: calc(100vh - #{$extra-height});
    }

    @include larger-than-lg() {
      $flexible-max-width: calc(#{$content-width} - #{$g-navigation-drawer-width * 0.9});
      $extra-height: $g-header-height + $card-footer-height + $g-footer-height;

      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: $content-side-padding;
      max-width: min(#{$flexible-max-width}, #{$content-max-width});
      max-height: calc(100vh - #{$extra-height});
    }

    &--searching,
    &--empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 120px;
      padding: 0 24px;
    }
  }

  &__group {
    margin-bottom: 12px;

    @include smaller-than-lg() {
      max-width: calc(#{$content-width} - #{$content-side-padding * 2});
    }

    @include larger-than-lg() {
      $content-width-with-nav: calc((#{$content-width} - #{$g-navigation-drawer-width}) / 2);
      $flexible-max-width: calc((#{$content-width} - #{$g-navigation-drawer-width}) / 2);

      max-width: min(#{$flexible-max-width}, #{$content-width / 2});
    }
  }

  &__moreButton {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.3);
</style>
