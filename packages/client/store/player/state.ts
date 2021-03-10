export type State = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined;
}

const state = (): State => ({
  playbackPlayer: undefined,
});

export default state;
