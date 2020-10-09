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
        {{ followButton(hover).icon }}
      </v-icon>
      {{ followButton(hover).text }}
    </v-btn>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

type FollowButton = {
  icon: 'mdi-heart-plus-outline' | 'mdi-heart-outline' | 'mdi-heart';
  text: 'フォロー' | 'フォローしない' | 'フォロー中';
}

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
    followButton(): (hover: boolean) => FollowButton {
      return (hover: boolean) => {
        if (!this.value) {
          return {
            icon: 'mdi-heart-plus-outline',
            text: 'フォロー',
          };
        }
        return hover
          ? {
            icon: 'mdi-heart-outline',
            text: 'フォローしない',
          }
          : {
            icon: 'mdi-heart',
            text: 'フォロー中',
          };
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
