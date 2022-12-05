import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBadge as Presentation } from "../components";
import { useBroadcastChannel } from "../hooks/use-broadcast";

export function StatusBadge({ id, status }) {
  const [innerStatus, setStatus] = useState(status);
  const registerBroadcast = useBroadcastChannel("entity-register");
  const updateBroadcast = useBroadcastChannel("entity-update");

  const handleUpdate = useCallback((event) => {
    const target = event.data?.statuses?.[id];
    const hasUpdate = !!target;

    if (hasUpdate) {
      console.log("has update!", id);
      setStatus(target);
    }
  }, []);

  useEffect(() => {
    updateBroadcast.addEventListener("message", handleUpdate);

    return () => {
      updateBroadcast.removeEventListener("message", handleUpdate);
    };
  }, [handleUpdate]);

  useEffect(() => {
    registerBroadcast.postMessage({
      type: "REGISTER",
      id,
    });

    return () => {
      registerBroadcast.postMessage({
        type: "UNREGISTER",
        id,
      });
    };
  }, []);

  return <Presentation status={innerStatus} />;
}
