<template>
  <Modal
    v-model="modal"
    :fullscreen="$screen.isSingleColumn"
    :class="$style.PlaylistModal"
  >
    <template #header>
      プレイリストの{{ detailText }}
    </template>

    <template #footer>
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
        :disabled="!isValid"
        @click="createPlaylist"
      >
        {{ resultText || detailText }}
      </v-btn>
    </template>

    <v-form
      :ref="FORM_REF"
      v-model="isValid"
      :class="$style.Content"
      class="g-custom-scroll-bar"
    >
      <v-text-field
        v-model="playlistName"
        autofocus
        label="名前"
        clearable
        required
        :rules="playlistNameRules"

        @keydown.enter.prevent
      />
      <v-textarea
        v-model="playlistDescription"
        label="説明"
        clearable
        :rows="3"
      />
      <v-file-input
        v-model="playlistArtwork"
        clearable
        show-size
        label="画像を選択"
        accept="image/*"
        prepend-icon="mdi-camera"
      />
      <v-checkbox
        v-model="isPrivatePlaylist"
        label="プレイリストを非公開にする"
        :disabled="isCollaborativePlaylist"
      />
      <v-checkbox
        v-model="isCollaborativePlaylist"
        label="コラボプレイリストにする"
        :class="$style['Content__collaborative--last']"
      />
    </v-form>
  </Modal>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ExtendedMutationPayload } from 'typed-vuex';

import Modal from '~/components/parts/modal/Modal.vue';
import { SpotifyAPI } from '~~/types';

const FORM_REF = 'FORM_REF';

type Data = {
  isValid: boolean
  playlistName: string
  playlistDescription: string
  playlistArtwork: Blob | undefined
  isPrivatePlaylist: boolean
  isCollaborativePlaylist: boolean
  playlistNameRules: ((v: string) => boolean | string)[]
  isLoading: boolean
  mutationUnsubscribe: (() => void) | undefined
  FORM_REF: string;
}

// 編集するとき
export type Form = {
  playlistId: string
  name: string,
  description: string,
  images: SpotifyAPI.Image[],
  isPrivate: boolean
  isCollaborative: boolean
}

export type Handler<T extends | 'create' | 'edit'> = (payload: T extends 'edit' ?
  {
    playlistId: string,
    name: string
    description: string
    isPublic: boolean
    isCollaborative: boolean
  }
  : {
    name: string
    description: string
    isPublic: boolean
    isCollaborative: boolean
  }) => Promise<void>

export const INPUT = 'input';

export type On = {
  [INPUT]: boolean
}

export default Vue.extend({
  components: {
    Modal,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    form: {
      type: Object as PropType<Form | undefined>,
      default: undefined,
    },
    handler: {
      type: Function as PropType<Handler<'create' | 'edit'>>,
      required: true,
    },
    detailText: {
      type: String,
      required: true,
    },
    resultText: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  data(): Data {
    const playlistName = this.form?.name ?? '';
    const playlistDescription = this.form?.description ?? '';
    const playlistArtwork = undefined;
    const isPrivatePlaylist = this.form?.isPrivate ?? false;
    const isCollaborativePlaylist = this.form?.isCollaborative ?? false;

    return {
      isValid: playlistName !== '',
      playlistName,
      playlistDescription,
      playlistArtwork,
      isPrivatePlaylist,
      isCollaborativePlaylist,
      playlistNameRules: [
        (v: string) => v !== '' || 'プレイリスト名の入力は必須です。',
      ],
      isLoading: false,
      mutationUnsubscribe: undefined,
      FORM_REF,
    };
  },

  computed: {
    modal: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        const ref = this.$refs[FORM_REF];
        if (!value && ref != null) {
          // モーダルを閉じたときにバリデーションをリセット
          (ref as Vue & { resetValidation(): void }).resetValidation();
        }
        this.$emit(INPUT, value);
      },
    },
  },

  watch: {
    isCollaborativePlaylist(isCollaborative: boolean) {
      // コラボプレイリストの場合は非公開
      if (isCollaborative) {
        this.isPrivatePlaylist = true;
      }
    },
  },

  mounted() {
    // プレイリストが作成/編集された後、アップロードされた画像があれば更新する
    const subscribePlaylist = (mutationPayload: ExtendedMutationPayload<'playlists/ADD_PLAYLIST' | 'playlists/EDIT_PLAYLIST'>) => {
      if (this.playlistArtwork == null) return;

      const { id: playlistId } = mutationPayload.payload;
      const fileReader = new FileReader();
      const onLoad = () => {
        console.log(fileReader);
        this.$spotify.playlists.uploadPlaylistArtwork({
          playlistId,
          artwork: fileReader.result as string,
        }).then(() => {
          this.modal = false;
          this.$toast.push({
            color: 'primary',
            message: `プレイリストを${this.resultText || this.detailText}しました。`,
          });
          this.resetForm();
        }).catch(() => {
          this.$toast.push({
            color: 'error',
            message: '画像のアップロードに失敗しました。',
          });
        }).finally(() => {
          this.isLoading = false;
          fileReader.removeEventListener('load', onLoad);
        });
      };
      fileReader.addEventListener('load', onLoad);

      // @todo
      const onError = (err: ProgressEvent<FileReader>) => {
        console.warn(err);
        this.isLoading = false;
        this.$toast.push({
          color: 'error',
          message: '画像の読み込みに失敗しました。',
        });
        fileReader.removeEventListener('error', onError);
      };
      fileReader.addEventListener('error', onError);

      fileReader.readAsDataURL(this.playlistArtwork);
    };

    this.mutationUnsubscribe = this.$subscribe((mutation) => {
      const { type } = mutation;
      switch (type) {
        case 'playlists/ADD_PLAYLIST':
        case 'playlists/EDIT_PLAYLIST':
          subscribePlaylist(mutation as ExtendedMutationPayload<typeof type>);
          break;
        default:
          break;
      }
    });
  },

  beforeDestroy() {
    if (this.mutationUnsubscribe != null) {
      this.mutationUnsubscribe();
      this.mutationUnsubscribe = undefined;
    }
  },

  methods: {
    onCloseButtonClicked() {
      this.modal = false;
    },
    createPlaylist() {
      const userId = this.$getters()['auth/userId'];
      if (userId == null) return;

      this.isLoading = true;
      this.handler({
        playlistId: this.form?.playlistId,
        name: this.playlistName,
        description: this.playlistDescription,
        isPublic: !this.isPrivatePlaylist,
        isCollaborative: this.isCollaborativePlaylist,
      }).then(() => {
        if (this.playlistArtwork == null) {
          this.modal = false;
          this.$toast.push({
            color: 'primary',
            message: `プレイリストを${this.resultText || this.detailText}しました。`,
          });
          this.resetForm();
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    resetForm() {
      this.playlistName = this.form?.name ?? '';
      this.playlistDescription = this.form?.description ?? '';
      this.playlistArtwork = undefined;
      this.isPrivatePlaylist = this.form?.isPrivate ?? false;
      this.isCollaborativePlaylist = this.form?.isCollaborative ?? false;
    },
  },
});
</script>

<style lang="scss" module>
.PlaylistModal {
  z-index: z-index-of(modal);
}

.Content {
  min-height: 72px;
  // header と footer の分を差し引く
  max-height: calc(90vh - 2rem - 32px - 68px);
  // チェックボックスの hover effect がはみ出すのを考慮する
  margin: 0 -12px;
  padding: 0 12px;
  overflow-y: auto;

  &__collaborative--last {
    margin-top: 0;
  }
}
</style>
