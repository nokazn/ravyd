<template>
  <transition>
    <div :class="$style.ReleaseCardMask" class="test">
      <v-hover #default="{ hover }">
        <v-icon
          :size="size(hover)">
          mdi-play-circle
        </v-icon>
      </v-hover>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    size() {
      return (hover: boolean) => (hover
        ? 60
        : 48);
    },
  },
});
</script>

<style lang="scss" module>
.ReleaseCardMask {
  background-color: $g-mask-color;
  position: relative;
  transition: all .15s ease;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
