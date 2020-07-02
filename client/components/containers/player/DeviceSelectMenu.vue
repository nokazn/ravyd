<template>
  <v-menu
    :key="deviceItemList.length"
    v-model="isShown"
    top
    left
    offset-y
    :z-index="1001"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        :color="deviceButtonColor"
        title="デバイスを選択"
        :width="36"
        :height="36"
        v-on="on"
        @click="toggleMenu"
      >
        <v-icon>
          mdi-devices
        </v-icon>
      </v-btn>
    </template>

    <v-card :elevation="12">
      <v-list
        dense
        subheader
        :color="MENU_BACKGROUND_COLOR"
        :class="$style.DeviceSelectMenu"
      >
        <div :class="$style.DeviceSelectMenu__header">
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
          <DeviceSelectMenuItem
            v-for="(device, index) in deviceItemList"
            :key="`${device.id}-${index}`"
            v-bind="device"
            @on-clicked="onItemClicked"
          />
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

import DeviceSelectMenuItem, { DeviceInfo, On as OnItem } from '~/components/parts/list/DeviceSelectMenuItem.vue';
import { MENU_BACKGROUND_COLOR } from '~/variables';
import { SpotifyAPI } from '~~/types';

type Data = {
  isShown: boolean
  isRefreshingDeviceList: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
}

export default Vue.extend({
  components: {
    DeviceSelectMenuItem,
  },

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
        ? 'active-icon'
        : undefined;
    },
    deviceItemList(): DeviceInfo[] {
      // @todo any[] で推論されてしまう
      const activeDeviceList = this.$state().player.activeDeviceList as SpotifyAPI.Device[];

      return activeDeviceList.map((device) => ({
        id: device.id ?? undefined,
        type: device.type,
        isActive: device.is_active,
        title: device.is_active ? '再生中のデバイス' : device.name,
        subtitle: device.is_active ? device.name : 'Spotify Connect',
      }));
    },
  },

  methods: {
    toggleMenu() {
      this.isShown = !this.isShown;
    },
    async onUpdateButtonClicked() {
      this.isRefreshingDeviceList = true;
      await this.$dispatch('player/getActiveDeviceList');
      this.isRefreshingDeviceList = false;
    },
    onItemClicked(deviceId: OnItem['on-clicked']) {
      if (deviceId != null) {
        this.$dispatch('player/transferPlayback', { deviceId });
      }
    },
  },
});
</script>

<style lang="scss" module>
.DeviceSelectMenu {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
  }
}
</style>
