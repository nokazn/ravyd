<template>
  <v-dialog
    v-model="modal"
    :max-width="600"
    :class="$style.CreatePlaylistModal"
  >
    <v-card>
      <div :class="$style.CreatePlaylistModal__title">
        <v-card-title>
          プレイリストの作成
        </v-card-title>

        <v-btn
          icon
          title="閉じる"
          @click="onCloseButtonClicked"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <v-card-text>
        <div>
          <v-text-field
            v-model="playlistName"
            autofocus
            label="名前"
            clearable
            required
          />

          <v-textarea
            v-model="playlistDescription"
            label="説明"
            clearable
            :rows="3"
          />

          <v-file-input
            v-model="playlistArtwork"
            label="画像を選択"
            accept="image/*"
            prepend-icon="mdi-camera"
            clearable
            show-size
          />

          <v-checkbox
            v-model="isPrivatePlaylist"
            label="プレイリストを非公開にする"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <div :class="$style.CreatePlaylistModal__action">
          <v-btn
            text
            rounded
            :min-width="90"
            @click="onCloseButtonClicked"
          >
            キャンセル
          </v-btn>

          <v-btn
            rounded
            :min-width="90"
            color="success"
            :loading="isLoading"
            @click="createPlaylist"
          >
            作成
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export type Data = {
  playlistName: string
  playlistDescription: string
  playlistArtwork: Blob | undefined
  isPrivatePlaylist: boolean
  isLoading: boolean
}

const ON_CHANGED = 'on-changed';

export type On = {
  [ON_CHANGED]: boolean
}

export default Vue.extend({
  props: {
    isShown: {
      type: Boolean,
      required: true,
    },
  },

  data(): Data {
    return {
      playlistName: '',
      playlistDescription: '',
      playlistArtwork: undefined,
      isPrivatePlaylist: false,
      isLoading: false,
    };
  },

  computed: {
    modal: {
      get(): boolean {
        return this.isShown;
      },
      set(isShown: boolean) {
        this.$emit(ON_CHANGED, isShown);
      },
    },
  },

  methods: {
    onCloseButtonClicked() {
      this.$emit(ON_CHANGED, false);
    },
    async createPlaylist() {
      const userId = this.$state().auth.userData?.id;
      if (userId == null) return;

      this.isLoading = true;

      const playlist = await this.$spotify.playlists.createPlaylist({
        userId,
        name: this.playlistName,
        description: this.playlistDescription,
        isPublic: !this.isPrivatePlaylist,
      });
      if (playlist == null) {
        return;
      }

      if (this.playlistArtwork == null) {
        this.isLoading = false;
        this.modal = false;
        return;
      }

      const fileReader = new FileReader();
      fileReader.addEventListener('load', async () => {
        await this.$spotify.playlists.uploadPlaylistArtwork({
          playlistId: playlist.id,
          artwork: fileReader.result as string,
        });

        this.isLoading = false;
        this.modal = false;
      });

      // @todo
      fileReader.addEventListener('error', (e) => {
        console.warn(e);
      });

      fileReader.readAsDataURL(this.playlistArtwork);
    },
  },
});
</script>

<style lang="scss" module>
.CreatePlaylistModal {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & > *:last-child {
      margin-right: 8px;
    }
  }
  &__action {
    padding: 12px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    & > *:not(:last-child) {
      margin-right: 12px;
    }
  }
}
</style>
