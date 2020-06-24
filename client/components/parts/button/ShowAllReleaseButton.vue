<template>
  <v-btn
    rounded
    text
    :width="width"
    :class="$style.ShowAllReleaseButton"
    @click="onClicked"
  >
    <v-icon :class="$style.ShowAllReleaseButton__icon">
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
    width: {
      type: Number,
      default: 200,
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
.ShowAllReleaseButton {
  &__icon {
    margin-right: 4px;
  }
}
</style>
