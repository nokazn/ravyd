<template>
  <v-btn
    rounded
    text
    small
    :min-width="120"
    @click="onClicked"
  >
    <div :class="$style.ShowAllButton">
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

export default Vue.extend({
  props: {
    isOmitted: {
      type: Boolean,
      required: true,
    },
    omittedLength: {
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
      return this.isOmitted
        ? {
          text: 'すべて表示',
          icon: 'mdi-chevron-down',
        }
        : {
          text: `${this.omittedLength}${this.unit}のみ表示`,
          icon: 'mdi-chevron-up',
        };
    },
  },

  methods: {
    onClicked() {
      this.$emit('on-clicked');
    },
  },
});
</script>

<style lang="scss" module>
.ShowAllButton {
  & > * {
    font-size: 0.9em;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
