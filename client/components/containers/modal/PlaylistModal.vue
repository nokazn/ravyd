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
        @click="closeModal"
      >
        キャンセル
      </v-btn>
      <v-btn
        rounded
        color="success"
        :min-width="90"
        :loading="isLoading"
        :disabled="!isValid"
        @click="handlePlaylist"
      >
        {{ text }}
      </v-btn>
    </template>

    <v-form
      ref="FORM_REF"
      v-model="isValid"
      :class="$style.Content"
      class="g-custom-scroll-bar"
    >
      <v-text-field
        v-model="playlist.name"
        autofocus
        clearable
        required
        label="名前"
        :rules="rules.name"
        @keydown.enter.prevent
      />
      <v-textarea
        v-model="playlist.description"
        clearable
        label="説明"
        :rows="3"
      />
      <v-file-input
        v-model="playlist.artwork"
        clearable
        show-size
        label="画像を選択"
        accept="image/jpeg"
        prepend-icon="mdi-camera"
        :rules="rules.artwork"
      />
      <v-checkbox
        v-model="playlist.isPrivate"
        label="プレイリストを非公開にする"
        :disabled="playlist.isCollaborative"
      />
      <v-checkbox
        v-model="playlist.isCollaborative"
        label="コラボプレイリストにする"
        :class="$style['Content__collaborative--last']"
      />
    </v-form>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  defineComponent,
  ref,
  reactive,
  toRef,
  computed,
  watch,
  PropType,
} from '@vue/composition-api';
import { InputValidationRules } from 'vuetify';
import { ExtendedMutationPayload } from 'typed-vuex';
import Modal from '~/components/parts/modal/Modal.vue';
import { extractBase64EncodedFile } from '~/utils/text';
import { useFileLoader } from '~/use/event';
import { useMutationSubscriber } from '~/use/observer';

type HandlerType = 'create' | 'edit';
type PlaylistBase = {
  name: string;
  description: string;
  isPrivate: boolean;
  isCollaborative: boolean;
}
type Playlist = PlaylistBase & { artwork: File | undefined; };
type FormRef = Vue & { resetValidation(): void; }
// 編集するときは playlistId を指定
export type Form = PlaylistBase & { playlistId?: string; }
export type Handler<T extends HandlerType> = (payload: T extends 'edit'
  ? {
    playlistId: string;
    name: string;
    description: string;
    isPublic: boolean;
    isCollaborative: boolean;
  }
  : {
    name: string;
    description: string;
    isPublic: boolean;
    isCollaborative: boolean;
  }
) => Promise<void>

export const INPUT = 'input';
export const UPDATE_IMAGE = 'update:image';

export type On = {
  [INPUT]: boolean;
  [UPDATE_IMAGE]: void;
}

export default defineComponent({
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
      type: Function as PropType<Handler<HandlerType>>,
      required: true,
    },
    detailText: {
      type: String,
      required: true,
    },
    handlerText: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  setup(props, { emit, root }) {
    const playlist = reactive<Playlist>({
      name: props.form?.name ?? '',
      description: props.form?.description ?? '',
      artwork: undefined,
      isPrivate: props.form?.isPrivate ?? false,
      isCollaborative: props.form?.isCollaborative ?? false,
    });
    const isValid = ref(playlist.name !== '');
    const isLoading = ref(false);
    const FORM_REF = ref<FormRef>();

    const text = props.handlerText || props.detailText;
    const rules: Record<'name' | 'artwork', InputValidationRules> = {
      name: [
        (v: string) => !!v || 'プレイリスト名の入力は必須です。',
      ],
      artwork: [
        (v: File | undefined) => v == null || v.type === 'image/jpeg' || 'アップロードできるファイル形式は jpeg のみです。',
        (v: File | undefined) => v == null || v.size <= 256 * 1000 || 'アップロードできるファイルの最大サイズは 256kB です。',
      ],
    };

    const modal = computed<boolean>({
      get() { return props.value; },
      set(v) {
        const element = FORM_REF.value;
        // モーダルを閉じたときにバリデーションをリセット
        if (!v && element != null && 'resetValidation' in element) {
          element.resetValidation();
        }
        emit(INPUT, v);
      },
    });

    watch((toRef(playlist, 'isCollaborative')), (collaborative) => {
      // コラボプレイリストの場合は非公開
      if (collaborative) {
        playlist.isPrivate = true;
      }
    });

    const closeModal = () => {
      modal.value = false;
    };
    const resetForm = () => {
      isLoading.value = false;
      closeModal();
      root.$nextTick().then(() => {
        playlist.name = props.form?.name ?? '';
        playlist.description = props.form?.description ?? '';
        playlist.artwork = undefined;
        playlist.isPrivate = props.form?.isPrivate ?? false;
        playlist.isCollaborative = props.form?.isCollaborative ?? false;
      });
    };
    const handlePlaylist = () => {
      isLoading.value = true;
      props.handler({
        // TODO: 型エラー回避のため
        playlistId: props.form?.playlistId ?? '',
        name: playlist.name,
        description: playlist.description,
        isPublic: !playlist.isPrivate,
        isCollaborative: playlist.isCollaborative,
      }).then(() => {
        if (playlist.artwork == null) {
          resetForm();
          root.$toast.pushPrimary(`プレイリストを${text}しました。`);
        }
      }).catch(() => {
        isLoading.value = false;
      });
    };

    // プレイリストが作成/編集された後、アップロードされた画像があれば更新する
    const subscribePlaylist = ({
      payload: { id: playlistId },
    }: ExtendedMutationPayload<'playlists/ADD_PLAYLIST' | 'playlists/EDIT_PLAYLIST'>) => {
      if (playlist.artwork == null) return;
      const fileReader = useFileLoader((_, f) => {
        const artwork = extractBase64EncodedFile(f);
        if (artwork == null) return;
        root.$spotify.playlists.uploadPlaylistArtwork({
          playlistId,
          artwork,
        }).then(() => {
          resetForm();
          emit(UPDATE_IMAGE);
          root.$toast.pushPrimary(`プレイリストを${text}しました。`);
        }).catch(() => {
          isLoading.value = false;
          root.$toast.pushError('画像のアップロードに失敗しました。');
        });
      }, () => {
        isLoading.value = false;
        root.$toast.pushError('画像の読み込みに失敗しました。');
      });
      fileReader.readAsDataURL(playlist.artwork);
    };
    useMutationSubscriber(root, ['playlists/ADD_PLAYLIST', 'playlists/EDIT_PLAYLIST'], subscribePlaylist);

    return {
      playlist,
      isValid,
      isLoading,
      FORM_REF,
      rules,
      text,
      modal,
      closeModal,
      handlePlaylist,
    };
  },
});
</script>

<style lang="scss" module>
.PlaylistModal {
  z-index: z-index-of(modal);
}

.Content {
  height: 100%;
  // チェックボックスの hover effect がはみ出すのを考慮する
  margin: 0 -12px;
  padding: 0 12px;
  overflow-y: auto;

  &__collaborative--last {
    margin-top: 0;
  }
}
</style>
