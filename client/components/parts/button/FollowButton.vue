<template>
  <v-hover #default="{ hover }">
    <v-btn
      rounded
      :outlined="!isFollowing"
      :width="180"
      @click="onClicked"
    >
      <v-icon
        :size="18"
        :class="$style.FollowButton__icon"
      >
        {{ followIcon(hover) }}
      </v-icon>
      {{ followText(hover) }}
    </v-btn>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';

export type FollowIcon = 'mdi-account-plus'
  | 'mdi-account-minus'
  | 'mdi-heart';

export type FollowText = 'フォロー'
  | 'フォローしない'
  | 'フォロー中'

const ON_CLICKED = 'on-clicked';

export type On = {
  [ON_CLICKED]: boolean
}

export default Vue.extend({
  props: {
    isFollowing: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    followIcon(): (hover: boolean) => FollowIcon {
      return (hover: boolean) => {
        if (!this.isFollowing) {
          return 'mdi-account-plus';
        }
        return hover
          ? 'mdi-account-minus'
          : 'mdi-heart';
      };
    },
    followText(): (hover: boolean) => FollowText {
      return (hover: boolean) => {
        if (!this.isFollowing) return 'フォロー';
        return hover
          ? 'フォローしない'
          : 'フォロー中';
      };
    },
  },
  methods: {
    onClicked() {
      this.$emit(ON_CLICKED, !this.isFollowing);
    },
  },
});
</script>

<style lang="scss" module>
.FollowButton__icon {
  margin-right: 8px;
}
</style>
