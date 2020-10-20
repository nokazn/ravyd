<template>
  <OptionMenu
    offset-y
    :nudge-bottom="2"
  >
    <template #activator="{ on }">
      <div
        :title="userDisplayName"
        :class="$style.UserMenuButton"
        v-on="on"
      >
        <UserAvatar
          type="user"
          :src="userAvatarSrc"
          :alt="userDisplayName"
          :size="AVATAR_SIZE"
        />

        <template v-if="!hideText">
          <span :class="$style.UserMenuButton__name">
            @{{ userDisplayName }}
          </span>
          <v-icon x-small>
            mdi-chevron-down
          </v-icon>
        </template>
      </div>
    </template>

    <template v-for="(itemList, index) in itemLists">
      <v-list-item
        v-for="item in itemList"
        :key="item.title"
        nuxt
        link
        :to="item.to"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider
        v-show="itemLists.length !== index + 1"
        :key="index"
      />
    </template>
  </OptionMenu>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

import OptionMenu from '~/components/parts/menu/OptionMenu.vue';
import UserAvatar from '~/components/parts/image/UserAvatar.vue';

const AVATAR_SIZE = 32;

type MenuItem = {
  title: string;
  to: string | undefined;
  disabled?: boolean;
}

export default defineComponent({
  components: {
    OptionMenu,
    UserAvatar,
  },

  props: {
    hideText: {
      type: Boolean,
      default: false,
    },
  },

  setup(_, { root }) {
    const itemLists = computed<MenuItem[][]>(() => {
      const userId = root.$getters()['auth/userId'];
      const profilePath = userId != null
        ? `/users/${userId}`
        : undefined;
      return [
        [
          { title: 'アカウント', to: '/account' },
          { title: 'プロフィール', to: profilePath, disabled: profilePath == null },
        ],
        [
          { title: 'ログアウト', to: '/logout' },
        ],
      ];
    });
    const userAvatarSrc = computed(() => root.$getters()['auth/userAvatarSrc'](AVATAR_SIZE));
    const userDisplayName = computed(() => root.$getters()['auth/userDisplayName']);

    return {
      itemLists,
      AVATAR_SIZE,
      userAvatarSrc,
      userDisplayName,
    };
  },
});
</script>

<style lang="scss" module>
.UserMenuButton {
  cursor: pointer;
  display: flex;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 8px;
  }

  &__name {
    font-size: 1.1em;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
