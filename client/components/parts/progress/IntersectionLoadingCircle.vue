<template>
  <div
    ref="loading"
    :class="$style.LoadingCircle"
  >
    <v-progress-circular
      v-if="isLoading"
      indeterminate
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export type Data = {
  observer: IntersectionObserver | undefined
}

export type On = {
  'on-appeared': undefined
}

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      observer: undefined,
    };
  },

  mounted() {
    const loading = this.$refs.loading as HTMLDivElement;

    // loading が表示されたら親コンポーネントに通知
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit('on-appeared');
        }
      });
    });
    this.observer.observe(loading);
  },

  beforeDestroy() {
    if (this.observer != null) this.observer.disconnect();
  },
});
</script>

<style lang="scss" module>
.LoadingCircle {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
