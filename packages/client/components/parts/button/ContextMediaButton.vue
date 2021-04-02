<template>
  <v-btn
    color="success"
    :fab="fab"
    :rounded="!fab"
    :width="fab ? height : undefined"
    :height="height"
    :disabled="disabled"
    :title="button.text"
    @click="onClick"
  >
    <v-icon v-if="fab">
      {{ button.icon }}
    </v-icon>
    <div
      v-else
      :class="$style.Container"
    >
      <v-icon left>
        {{ button.icon }}
      </v-icon>
      <span>
        {{ button.text }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

const INPUT = 'input';

export type On = {
  [INPUT]: boolean;
};

type Button = {
  icon: 'mdi-play' | 'mdi-pause';
  text: '再生' | '停止';
};

export default defineComponent({
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

  emits: {
    [INPUT]: (_value: boolean) => true,
  },

  setup(props, { emit }) {
    const button = computed((): Button => {
      return props.value
        ? {
          icon: 'mdi-pause',
          text: '停止',
        }
        : {
          icon: 'mdi-play',
          text: '再生',
        };
    });
    const onClick = () => { emit(INPUT, !props.value); };

    return {
      button,
      onClick,
    };
  },
});
</script>

<style lang="scss" module>
.Container {
  padding: 0 0.75em;
}
</style>
