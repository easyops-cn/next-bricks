// istanbul ignore file
export async function getBroadcastChannelPolyfill(): Promise<
  typeof BroadcastChannel
> {
  if (window.BroadcastChannel) {
    return window.BroadcastChannel;
  }
  return (await import("broadcast-channel"))
    .BroadcastChannel as unknown as typeof BroadcastChannel;
}
