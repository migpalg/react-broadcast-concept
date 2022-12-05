import { StatusEvents } from "../events/status-events";
import { StatusBadge } from "../wrappers/status-badge";

export const App = () => {
  return (
    <div>
      <h2>Hello world!</h2>
      <StatusEvents>
        <StatusBadge id={1} />
        <StatusBadge id={2} />
        <StatusBadge id={3} />
        <StatusBadge id={4} />
        <StatusBadge id={5} />
        <StatusBadge id={6} />
        <StatusBadge id={7} />
        <StatusBadge id={8} />
        <StatusBadge id={8} />
        <StatusBadge id={10} />
      </StatusEvents>
    </div>
  );
};
