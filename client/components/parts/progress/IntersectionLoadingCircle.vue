<template>
  <div
    :ref="LOADING_REF"
    :class="$style.LoadingCircle"
  >
    <v-progress-circular
      v-if="loading"
      indeterminate
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const LOADING_REF = 'LOADING_REF';

export type Data = {
  observer: IntersectionObserver | undefined
  LOADING_REF: string
}

const APPEAR = 'appear';

export type On = {
  [APPEAR]: void
}

export default Vue.extend({
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      observer: undefined,
      LOADING_REF,
    };
  },

  mounted() {
    const loading = this.$refs[LOADING_REF] as HTMLDivElement;

    // loading が表示されたら親コンポーネントに通知
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit(APPEAR);
        }
      });
    }, {
      rootMargin: '400px 0px',
    });
    this.observer.observe(loading);
  },

  beforeDestroy() {
    if (this.observer != null) {
      this.observer.disconnect();
      this.observer = undefined;
    }
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
