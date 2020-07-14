<template>
  <v-menu
    :key="deviceItemList.length"
    v-model="isShown"
    top
    left
    offset-y
    :z-index="Z_INDEX"
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

    <v-list
      dense
      subheader
      :elevation="12"
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

      <v-list-item-group
        :class="$style.DeviceSelectMenu__wrapper"
        class="g-custom-scroll-bar"
      >
        <DeviceSelectMenuItem
          v-for="(device, index) in deviceItemList"
          :key="`${device.id}-${index}`"
          v-bind="device"
          @on-clicked="onItemClicked"
        />
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';

import DeviceSelectMenuItem, { DeviceInfo, On as OnItem } from '~/components/parts/list/DeviceSelectMenuItem.vue';
import { MENU_BACKGROUND_COLOR, Z_INDEX_OF } from '~/variables';
import { SpotifyAPI } from '~~/types';

type Data = {
  isShown: boolean
  isRefreshingDeviceList: boolean
  MENU_BACKGROUND_COLOR: typeof MENU_BACKGROUND_COLOR
  Z_INDEX: number
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
      Z_INDEX: Z_INDEX_OF.menu,
    };
  },

  computed: {
    deviceButtonColor(): string | undefined {
      return this.$getters()['player/isThisAppPlaying']
        ? 'active-icon'
        : undefined;
    },
    deviceItemList(): DeviceInfo[] {
      // @todo any[] で推論されてしまう
      const deviceList = this.$state().player.deviceList as SpotifyAPI.Device[];
      const disabled = this.$getters()['player/isDisallowed']('transferring_playback');

      return deviceList.map((device) => ({
        id: device.id ?? undefined,
        type: device.type,
        isActive: device.is_active,
        disabled: device.id == null || disabled,
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
      } else {
        this.$toast.show('error', 'デバイスを変更できません。');
      }
    },
  },
});
</script>

<style lang="scss" module>
.DeviceSelectMenu {
  max-width: min(400px, 80vw);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
  }

  &__wrapper {
    min-height: 64px;
    // header の分を差し引く
    max-height: calc(70vh - 40px);
    overflow-y: auto;
  }
}
</style>
