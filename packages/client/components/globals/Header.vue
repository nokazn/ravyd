<template>
  <v-app-bar
    app
    :elevation="headerElevation"
    :height="$constant.HEADER_HEIGHT"
    :style="styles"
    :class="$style.Header"
  >
    <div :class="$style.Header__container">
      <div :class="$style.Header__left">
        <div
          v-if="$screen.isMultiColumn"
          :class="$style.Header__buttons"
        >
          <CircleButton
            :size="36"
            :icon-size="32"
            title="戻る"
            @click="onBackButtonClicked"
          >
            mdi-chevron-left
          </CircleButton>
          <CircleButton
            :size="36"
            :icon-size="32"
            title="進む"
            @click="onForwardButtonClicked"
          >
            mdi-chevron-right
          </CircleButton>
        </div>

        <Search />
      </div>

      <div :class="$style.Header__right">
        <template v-if="!$screen.isSp">
          <transition name="fade">
            <portal-target
              v-show="$header.fab"
              :name="$header.PORTAL_NAME"
            />
          </transition>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

import CircleButton from '~/components/parts/button/CircleButton.vue';
import Search from '~/components/globals/Search.vue';

type HeaderStyles = {
  backgroundColor: string;
  backdropFilter?: string;
};

export default defineComponent({
  components: {
    CircleButton,
    Search,
  },

  props: {
    elevation: {
      type: Number,
      required: true,
    },
  },

  setup(props, { root }) {
    const styles = computed<HeaderStyles>(() => {
      const backgroundStyles = root.$getters().headerStyles;
      const { backdropFiltered } = root.$header;
      if (backdropFiltered) {
        return {
          ...backgroundStyles,
          backdropFilter: 'blur(16px)',
        };
      }
      const dominantColor = root.$getters().dominantBackgroundColor;
      return {
        backgroundColor: dominantColor?.hex ?? root.$constant.BACKGROUND_COLOR,
      };
    });
    // backdrop-filter が有効のときはヘッダーの下に sticky なコンテンツがないので elavation を有効にする
    const headerElevation = computed(() => {
      return root.$header.backdropFiltered
        ? props.elevation
        : 0;
    });

    const onBackButtonClicked = () => { root.$router.back(); };
    const onForwardButtonClicked = () => { root.$router.forward(); };

    return {
      styles,
      headerElevation,
      onBackButtonClicked,
      onForwardButtonClicked,
    };
  },
});
</script>

<style lang="scss" module>
.Header {
  z-index: z-index-of(header) !important;

  &__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
  }

  &__left,
  &__right {
    display: flex;
    align-items: center;
  }

  &__left {
    & > *:not(:last-child) {
      margin-right: 16px;
    }
  }
}
</style>

<style lang="scss" scoped>
@include fade-transition(0.2);
</style>
