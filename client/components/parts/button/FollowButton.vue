<template>
  <v-hover #default="{ hover }">
    <v-btn
      rounded
      :width="172"
      :color="color"
      :outlined="!value"
      :height="height"
      @click="onClicked"
    >
      <v-icon
        :size="18"
        left
      >
        {{ followIcon(hover) }}
      </v-icon>
      {{ followText(hover) }}
    </v-btn>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

export type FollowIcon = 'mdi-heart-plus-outline' | 'mdi-heart-outline' | 'mdi-heart';

export type FollowText = 'フォロー' | 'フォローしない' | 'フォロー中'

const INPUT = 'input';

export type On = {
  [INPUT]: boolean
}

export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    height: {
      type: Number,
      default: 36,
    },
  },

  computed: {
    color(): string | undefined {
      return this.value
        ? 'grey darken-3'
        : undefined;
    },
    followIcon(): (hover: boolean) => FollowIcon {
      return (hover: boolean) => {
        if (!this.value) return 'mdi-heart-plus-outline';
        return hover
          ? 'mdi-heart-outline'
          : 'mdi-heart';
      };
    },
    followText(): (hover: boolean) => FollowText {
      return (hover: boolean) => {
        if (!this.value) return 'フォロー';
        return hover
          ? 'フォローしない'
          : 'フォロー中';
      };
    },
  },
  methods: {
    onClicked() {
      this.$emit(INPUT, !this.value);
    },
  },
});
</script>
