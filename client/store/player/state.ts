export type PlayerState = {
  playbackPlayer: Spotify.SpotifyPlayer | undefined
}

const state = (): PlayerState => ({
  playbackPlayer: undefined,
});

export default state;
