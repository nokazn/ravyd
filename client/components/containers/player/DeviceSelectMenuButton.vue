<template>
  <v-menu
    v-model="isShown"
    top
    left
    :nudge-top="40"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :color="deviceButtonColor"
        title="デバイスを選択"
        v-on="on"
        @click="onDeviceButtonClicked"
      >
        <v-icon :size="20">
          mdi-devices
        </v-icon>
      </v-btn>
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="MENU_BACKGROUND_COLOR"
        :class="$style.DeviceSelectMenuList"
      >
        <div :class="$style.DeviceSelectMenuList__header">
          <v-subheader>
            デバイスを選択
          </v-subheader>

          <v-btn
            icon
            small
            :loading="isRefreshingDeviceList"
            title="デバイスの一覧を更新"
            @click.stop="onUpdateButtonClicked"
          >
            <v-icon>
              mdi-refresh
            </v-icon>
          </v-btn>
        </div>

        <v-divider />

        <v-list-item-group>
          <v-list-item
            v-for="device in deviceItemList"
            :key="device.id"
            dense
            two-line
            :class="$style.DeviceSelectMenuList__listItem"
            @click="onListItemClickedHandler(device.id)"
          >
            <v-list-item-avatar>
              <v-icon
                :size="32"
                :color="device.color"
                v-text="device.icon"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                :class="[
                  $style.DeviceSelectMenuList__listItemTitle,
                  device.textClass
                ]"
                v-text="device.title"
              />

              <v-list-item-subtitle
                :class="[
                  $style.DeviceSelectMenuList__listItemSubtitle,
                  device.textClass,
                ]"
              >
                <v-icon
                  v-if="device.isActive"
                  :color="device.color"
                  :size="16"
                >
                  mdi-volume-high
                </v-icon>
                <span>
                  {{ device.subtitle }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

import { MENU_BACKGROUND_COLOR } from '~/variables';
import { SpotifyAPI } from '~~/types';

type Data = {
  isShown: boolean
  isRefreshingDeviceList: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
}

type DeviceInfo = {
  id: string | null
  title: string
  subtitle: string
  isActive: boolean
  icon: string
  color: 'cyan accent-2' | undefined
  textClass: 'cyan--text text--accent-2' | undefined
}

const deviceIcon = (type: SpotifyAPI.Device['type']): string => {
  switch (type) {
    case 'Computer':
      return 'mdi-laptop';
    case 'Smartphone':
      return 'mdi-phone';
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
  data(): Data {
    return {
      isShown: false,
      isRefreshingDeviceList: false,
      MENU_BACKGROUND_COLOR,
    };
  },

  computed: {
    deviceButtonColor(): string | undefined {
      return this.$getters()['player/isTheAppPlaying']
        ? 'cyan'
        : undefined;
    },
    deviceItemList(): DeviceInfo[] {
      // @todo any[] で推論されてしまう
      const activeDeviceList = this.$state().player.activeDeviceList as SpotifyAPI.Device[];
      return activeDeviceList.map((device) => ({
        id: device.id,
        isActive: device.is_active,
        title: device.is_active ? '再生中のデバイス' : device.name,
        subtitle: device.is_active ? device.name : 'Spotify Connect',
        icon: deviceIcon(device.type),
        color: device.is_active ? 'cyan accent-2' : undefined,
        textClass: device.is_active ? 'cyan--text text--accent-2' : undefined,
      }));
    },
  },

  methods: {
    onDeviceButtonClicked() {
      this.isShown = !this.isShown;
    },
    async onUpdateButtonClicked() {
      this.isRefreshingDeviceList = true;
      await this.$dispatch('player/getActiveDeviceList');
      this.isRefreshingDeviceList = false;
    },
    onListItemClickedHandler(id: string) {
      this.$dispatch('player/transferPlayback', { deviceId: id });
    },
  },
});
</script>

<style lang="scss" module>
.DeviceSelectMenuList {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
  }
  &__listItemTitle {
    font-size: 0.9em!important;
    margin-bottom: 6px!important;
  }
  &__listItemSubtitle {
    font-size: 0.8em!important;
  }
}
</style>
