import { useCallback, useEffect, useRef } from "react";
import { useBroadcastChannel } from "../hooks/use-broadcast";
import StatusWorker from "../workers/status-worker?worker";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 *
 * @param {object} props element props
 * @returns
 */
export function StatusEvents({ children }) {
  const registeredEntities = useRef(new Set());
  const registerChannel = useBroadcastChannel("entity-register");
  const updateBroadcast = useBroadcastChannel("entity-update");

  const handleRegistration = useCallback((event) => {
    switch (event.data.type) {
      case "REGISTER":
        registeredEntities.current.add(event.data.id);
        break;
      case "UNREGISTER":
        registeredEntities.current.delete(event.data.id);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    const worker = new StatusWorker();

    worker.postMessage({
      action: "FETCH_STATUSES",
    });

    worker.addEventListener("message", function (event) {
      const action = event.data;

      if (action.type === "STATUSES_UPDATE") {
        const updated = randomIntFromInterval(
          0,
          registeredEntities.current.size - 1
        );

        updateBroadcast.postMessage({
          type: "UPDATE",
          statuses: {
            [[...registeredEntities.current][updated]]: "MCK",
          },
        });
      }
    });

    return () => {
      worker.postMessage({
        action: "STOP_FETCH_STATUSES",
      });

      worker.terminate();
    };
  }, []);

  useEffect(() => {
    registerChannel.addEventListener("message", handleRegistration);

    return () => {
      registerChannel.removeEventListener("message", handleRegistration);
    };
  }, [handleRegistration]);

  return children;
}
