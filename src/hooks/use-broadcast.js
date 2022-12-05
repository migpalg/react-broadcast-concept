import { useMemo } from "react";

export function useBroadcastChannel(name) {
  const broadcast = useMemo(() => new BroadcastChannel(name), []);
  return broadcast;
}
