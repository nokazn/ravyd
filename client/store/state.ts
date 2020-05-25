export type RootState = {
  dominantBackgroundColor: string | undefined
}

const state = (): RootState => ({
  dominantBackgroundColor: undefined,
});

export default state;
