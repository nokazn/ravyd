<template>
  <v-list-item
    dense
    two-line
    :disabled="item.disabled"
    :inactive="item.disabled"
    @click="onClick"
  >
    <v-list-item-avatar>
      <v-icon
        :size="32"
        :color="iconColor"
      >
        {{ icon }}
      </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title :class="textColor">
        {{ item.title }}
      </v-list-item-title>

      <v-list-item-subtitle :class="subtextColor">
        <v-icon
          v-show="item.isActive"
          :color="iconColor"
          :size="16"
        >
          mdi-volume-high
        </v-icon>

        <span>
          {{ item.subtitle }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { textColorClass, subtextColorClass, itemColor } from '~/utils/text';
import { App, SpotifyAPI } from '~~/types';

const CLICK = 'click';

export type On = {
  [CLICK]: App.Device['id'];
}

const deviceIcon = (type: SpotifyAPI.Device['type']): string => {
  switch (type) {
    case 'Computer':
      return 'mdi-laptop';
    case 'Smartphone':
      return 'mdi-cellphone';
    case 'Tablet':
      return 'mdi-tablet';
    case 'Speaker':
      return 'mdi-speaker';
    case 'TV':
      return 'mdi-television';
    case 'CastAudio':
      return 'mdi-cast-audio';
    case 'Automobile':
      return 'mdi-car';
    case 'AVR':
    case 'STB':
    case 'AudioDongle':
      return 'mdi-audio-video';
    case 'GameConsole':
      return 'mdi-gamepad-variant-outline';
    case 'CastVideo':
      return 'mdi-cast';
    default:
      return 'mdi-help';
  }
};

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<App.Device>,
      required: true,
    },
  },

  emits: {
    [CLICK]: (_id: string) => true,
  },

  setup(props, { emit }) {
    const icon = computed(() => deviceIcon(props.item.type));
    const textColor = computed(() => textColorClass(
      props.item.isActive,
      props.item.disabled,
    ));
    const subtextColor = computed(() => subtextColorClass(
      props.item.isActive,
      props.item.disabled,
    ));
    const iconColor = computed(() => itemColor(
      props.item.isActive,
      props.item.disabled,
    ));
    const onClick = () => { emit(CLICK, props.item.id); };

    return {
      icon,
      iconColor,
      textColor,
      subtextColor,
      onClick,
    };
  },
});
</script>
