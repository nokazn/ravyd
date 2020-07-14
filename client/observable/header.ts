import Vue from 'vue';

const PORTAL_NAME = 'CONTENT_HEADER';

type HeaderState = {
  isShown: boolean
  isOn: boolean
  extensionHeight: number
}

export type Header = {
  readonly isExtended: boolean
  readonly isShown: boolean
  readonly isOn: boolean
  readonly extensionHeight: number
  readonly PORTAL_NAME: typeof PORTAL_NAME
  change: (isShown: boolean) => void
  on: () => void
  off: () => void
  setExtensionHeight:(extensionHeight: number) => void
}

const state = Vue.observable<HeaderState>({
  isShown: false,
  isOn: false,
  extensionHeight: 0,
});

export const $header: Header = {
  get isExtended(): boolean {
    return state.isShown && state.isOn;
  },
  get isShown(): boolean {
    return state.isShown;
  },
  get isOn(): boolean {
    return state.isOn;
  },
  get extensionHeight(): number {
    return state.extensionHeight;
  },
  get PORTAL_NAME(): typeof PORTAL_NAME {
    return PORTAL_NAME;
  },

  change(isShown: boolean) {
    state.isShown = isShown;
  },
  on() {
    state.isOn = true;
  },
  off() {
    state.isOn = false;
  },
  setExtensionHeight(extensionHeight: number) {
    state.extensionHeight = extensionHeight;
  },
};
