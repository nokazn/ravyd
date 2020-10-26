<template>
  <CustomMenu
    :key="deviceItemList.length"
    v-model="isShown"
    top
    left
    offset-y
    :class="$style.DeviceSelectMenu"
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

    <template #header>
      <div :class="$style.DeviceSelectMenu__header">
        <v-subheader>
          デバイスを選択
        </v-subheader>

        <v-btn
          icon
          small
          :loading="isRefreshingDeviceList"
          title="デバイスの一覧を更新"
          @click.stop="updateDeviceList"
        >
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </div>
    </template>

    <v-list-item-group
      :class="$style.DeviceSelectMenu__wrapper"
      class="g-custom-scroll-bar"
    >
      <DeviceSelectMenuItem
        v-for="(device, index) in deviceItemList"
        :key="`${device.id}-${index}`"
        :item="device"
        @click="onItemClicked"
      />
    </v-list-item-group>
  </CustomMenu>
</template>

<script lang="ts">
import Vue from 'vue';

import CustomMenu from '~/components/parts/menu/CustomMenu.vue';
import DeviceSelectMenuItem, { On as OnItem } from '~/components/parts/list/DeviceSelectMenuItem.vue';
import type { App } from '~~/types';

type Data = {
  isShown: boolean
  isRefreshingDeviceList: boolean
}

export default Vue.extend({
  components: {
    CustomMenu,
    DeviceSelectMenuItem,
  },

  data(): Data {
    return {
      isShown: false,
      isRefreshingDeviceList: false,
    };
  },

  computed: {
    deviceButtonColor(): string | undefined {
      return this.$getters()['playback/isThisAppPlaying']
        ? 'active-icon'
        : undefined;
    },
    deviceItemList(): App.Device[] {
      return this.$getters()['playback/deviceList'];
    },
  },

  methods: {
    toggleMenu() {
      if (!this.isShown) {
        this.updateDeviceList();
      }
      this.isShown = !this.isShown;
    },
    async updateDeviceList() {
      this.isRefreshingDeviceList = true;
      await this.$dispatch('playback/getDeviceList');
      this.isRefreshingDeviceList = false;
    },
    onItemClicked(deviceId: OnItem['click']) {
      if (deviceId != null) {
        this.$dispatch('playback/transferPlayback', { deviceId });
      } else {
        this.$toast.pushError('デバイスを変更できません。');
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
