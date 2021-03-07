import type { App } from '~/entities';

export type State = {
  dominantBackgroundColor: App.DominantColor | undefined;
}

const state = (): State => ({
  dominantBackgroundColor: undefined,
});

export default state;
