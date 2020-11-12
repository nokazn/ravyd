<template>
  <CustomMenu
    :key="deviceList.length"
    v-model="menu"
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
          :loading="isRefreshing"
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
        v-for="(device, index) in deviceList"
        :key="`${device.id}-${index}`"
        :item="device"
        @click="onItemClicked"
      />
    </v-list-item-group>
  </CustomMenu>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api';
import CustomMenu from '~/components/parts/menu/CustomMenu.vue';
import DeviceSelectMenuItem, { On as OnItem } from '~/components/parts/list/DeviceSelectMenuItem.vue';

export default defineComponent({
  components: {
    CustomMenu,
    DeviceSelectMenuItem,
  },

  setup(_, { root }) {
    const menu = ref(false);
    const isRefreshing = ref(false);

    const deviceButtonColor = computed(() => {
      return root.$getters()['playback/isThisAppPlaying']
        ? 'active-icon'
        : undefined;
    });
    const deviceList = computed(() => root.$getters()['playback/deviceList']);

    const updateDeviceList = async () => {
      isRefreshing.value = true;
      await root.$dispatch('playback/getDeviceList');
      isRefreshing.value = false;
    };
    const toggleMenu = () => {
      if (!menu.value) {
        updateDeviceList();
      }
      menu.value = !menu.value;
    };
    const onItemClicked = (deviceId: OnItem['click']) => {
      if (deviceId != null) {
        root.$dispatch('playback/transferPlayback', { deviceId });
      } else {
        root.$toast.pushError('デバイスを変更できません。');
      }
    };

    return {
      menu,
      isRefreshing,
      deviceButtonColor,
      deviceList,
      updateDeviceList,
      toggleMenu,
      onItemClicked,
    };
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

  &__wrapper {
    max-width: min(400px, 80vw);
    min-height: 64px;
    // header の分を差し引く
    max-height: calc(70vh - 40px);
    overflow-y: auto;
  }
}
</style>
