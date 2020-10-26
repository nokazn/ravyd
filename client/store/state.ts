import { App } from '~~/types';

export type RootState = {
  dominantBackgroundColor: App.DominantColor | undefined;
}

const state = (): RootState => ({
  dominantBackgroundColor: undefined,
});

export default state;
