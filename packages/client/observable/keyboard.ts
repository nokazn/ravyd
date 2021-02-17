import Vue from 'vue';

type KeyboardEventKey = 'keydown' | 'keypress' | 'keyup';
export type Listener = (e: KeyboardEvent) => void;
export type EventListenerMap<Require extends boolean> = {
  event: KeyboardEventKey;
  listener: Listener;
} & (Require extends true
  ? { disabled: boolean; }
  : { disabled?: boolean; });
type KeyboardState = {
  eventListeners: { [k: string]: EventListenerMap<true>; }
}

export type $Keyboard = {
  readonly eventListener: (key: string) => Listener | undefined;
  readonly isDisabled: (key: string) => boolean | undefined;
  add: (key: string, params: Listener | EventListenerMap<false>) => void;
  remove: (key: string) => void;
  disable: (key: string) => void;
  enable: (key: string) => void;
}

const state = Vue.observable<KeyboardState>({
  eventListeners: {},
});

export const $keyboard: $Keyboard = {
  get eventListener() {
    return (key: string) => state.eventListeners[key]?.listener;
  },

  get isDisabled() {
    return (key: string) => state.eventListeners[key]?.disabled;
  },

  add(key, eventListener) {
    if (typeof eventListener === 'function') {
      const listener = (e: KeyboardEvent) => {
        if (this.isDisabled(key) === false) {
          eventListener(e);
        }
      };
      const event = 'keydown';
      state.eventListeners[key] = {
        event,
        listener,
        disabled: false,
      };
      window.addEventListener(event, listener);
      return;
    }

    const listener = (e: KeyboardEvent) => {
      if (this.isDisabled(key) === false) {
        eventListener.listener(e);
      }
    };
    state.eventListeners[key] = {
      event: eventListener.event,
      listener,
      disabled: eventListener.disabled ?? false,
    };
    window.addEventListener(eventListener.event, listener);
  },

  remove(key) {
    const eventListener = state.eventListeners[key];
    if (eventListener != null) {
      window.removeEventListener(eventListener.event, eventListener.listener);
    }
  },

  disable(key: string) {
    const currentEventListener = state.eventListeners[key];
    state.eventListeners[key] = {
      ...currentEventListener,
      disabled: true,
    };
  },

  enable(key: string) {
    const currentEventListener = state.eventListeners[key];
    state.eventListeners[key] = {
      ...currentEventListener,
      disabled: false,
    };
  },
};
