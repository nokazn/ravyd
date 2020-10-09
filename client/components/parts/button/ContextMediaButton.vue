<template>
  <v-btn
    color="success"
    :fab="fab"
    :rounded="!fab"
    :width="fab ? height : undefined"
    :height="height"
    :disabled="disabled"
    :title="text"
    @click="onClicked"
  >
    <v-icon v-if="fab">
      {{ icon }}
    </v-icon>
    <div
      v-else
      :class="$style.Container"
    >
      <v-icon left>
        {{ icon }}
      </v-icon>
      <span>
        {{ text }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

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
    fab: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    icon(): 'mdi-play' | 'mdi-pause' {
      return this.value
        ? 'mdi-pause'
        : 'mdi-play';
    },
    text(): '再生' | '停止' {
      return this.value
        ? '停止'
        : '再生';
    },
  },

  methods: {
    onClicked() {
      this.$emit(INPUT, !this.value);
    },
  },
});
</script>

<style lang="scss" module>
.Container {
  padding: 0 0.75em;
}
</style>
