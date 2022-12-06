export class StatusWorker {
  /**
   * @private
   */
  _intervalId;

  /**
   * @private
   */
  _actionMap;

  /**
   * @private
   */
  _onStatusUpdateCallback;

  constructor() {
    this._actionMap = {
      FETCH_STATUSES: this.initStatusPooling.bind(this),
      STOP_FETCH_STATUSES: this.stopStatusPooling.bind(this),
    };
  }

  initStatusPooling() {
    if (this._intervalId) return;

    this._intervalId = setInterval(() => {
      this._onStatusUpdateCallback({ data: "test!" });
    }, 1000);
  }

  stopStatusPooling() {
    clearInterval(this._intervalId);
    this._intervalId = null;
  }

  handleAction(event) {
    if (!event.action) return;

    this._actionMap[event.action]?.();
  }

  onStatusUpdate(callback) {
    this._onStatusUpdateCallback = callback;
  }
}

const statusWorker = new StatusWorker();

self.onmessage = function (event) {
  // Handle message posting in the main thread
  console.log(event.data);
  statusWorker.handleAction(event.data);

  statusWorker.onStatusUpdate((data) => {
    self.postMessage({
      type: "STATUSES_UPDATE",
      data,
    });
  });
};
