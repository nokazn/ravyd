<template>
  <v-btn
    rounded
    text
    small
    :min-width="120"
    @click="onClicked"
  >
    <div :class="$style.ShowAllTracksButton">
      <v-icon small>
        {{ showAllButton.icon }}
      </v-icon>

      <span>
        {{ showAllButton.text }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

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
    abbreviatedLength: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: '曲',
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
          text: `${this.abbreviatedLength}${this.unit}のみ表示`,
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
.ShowAllTracksButton {
  & > * {
    font-size: 0.9em;

    &:not(:last-child) {
      margin-right: 4px;
    }
  }
}
</style>
