<template>
  <v-btn
    rounded
    text
    :width="width"
    :small="small"
    :class="$style.ShowAllButton"
    @click="onClicked"
  >
    <div :class="$style.ShowAllButton__wrapper">
      <v-icon
        :left="!icon"
        :small="small"
      >
        {{ showAllButton.icon }}
      </v-icon>

      <span v-if="!icon">
        {{ showAllButton.text }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export type ShowALlButton = {
  icon: 'mdi-chevron-down' | 'mdi-chevron-up'
  text: string
}

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: void
}

export default Vue.extend({
  props: {
    isAbbreviated: {
      type: Boolean,
      required: true,
    },
    width: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    small: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showAllButton(): ShowALlButton {
      return this.isAbbreviated
        ? {
          text: 'すべて表示',
          icon: 'mdi-chevron-down',
        }
        : {
          text: '折りたたむ',
          icon: 'mdi-chevron-up',
        };
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
.ShowAllButton {
  &__wrapper {
    padding: 0 0.8em;
  }
}
</style>
