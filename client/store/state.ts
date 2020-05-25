import { BACKGROUND_COLOR } from '~/variables';

export type RootState = {
  dominantBackgroundColor: string
}

const state = (): RootState => ({
  dominantBackgroundColor: BACKGROUND_COLOR,
});

export default state;
