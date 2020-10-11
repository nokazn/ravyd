<template>
  <v-list-item
    dense
    two-line
    :disabled="disabled"
    :inactive="disabled"
    @click="onItemClicked"
  >
    <v-list-item-avatar>
      <v-icon
        :size="32"
        :color="disabled ? 'inactive' : isActive ? 'active' : undefined"
      >
        {{ icon }}
      </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title
        :class="{
          'active--text': isActive,
          'inactive--text': disabled,
        }"
      >
        {{ title }}
      </v-list-item-title>

      <v-list-item-subtitle
        :class="{
          'active--text': isActive,
          'inactive--text': disabled,
        }"
      >
        <v-icon
          v-show="isActive"
          :color="disabled ? 'inactive' : isActive ? 'active' : undefined"
          :size="16"
        >
          mdi-volume-high
        </v-icon>

        <span>
          {{ subtitle }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { App, SpotifyAPI } from '~~/types';

export type DeviceInfo = App.DeviceInfo;

type Data = {
  icon: string
}

const CLICK = 'click';

export type On = {
  [CLICK]: App.DeviceInfo['id']
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

export default Vue.extend({
  props: {
    id: {
      type: String,
      default: undefined,
    },
    type: {
      type: String as PropType<SpotifyAPI.Device['type']>,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },

  data(): Data {
    return {
      icon: deviceIcon(this.type),
    };
  },

  methods: {
    onItemClicked() {
      this.$emit(CLICK, this.id);
    },
  },
});
</script>
