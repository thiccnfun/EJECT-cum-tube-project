import { d as derived, w as writable } from "./index.js";
function createNotificationStore() {
  const state = [];
  const _notifications = writable(state);
  function send(message, type = "info", timeout) {
    _notifications.update((state2) => {
      return [...state2, { id: id(), type, message, timeout }];
    });
  }
  const notifications2 = derived(_notifications, ($_notifications, set) => {
    set($_notifications);
    if ($_notifications.length > 0) {
      const timer = setTimeout(() => {
        _notifications.update((state2) => {
          state2.shift();
          return state2;
        });
      }, $_notifications[0].timeout);
      return () => {
        clearTimeout(timer);
      };
    }
  });
  const { subscribe } = notifications2;
  return {
    subscribe,
    send,
    error: (msg, timeout) => send(msg, "error", timeout),
    warning: (msg, timeout) => send(msg, "warning", timeout),
    info: (msg, timeout) => send(msg, "info", timeout),
    success: (msg, timeout) => send(msg, "success", timeout)
  };
}
function id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
const notifications = createNotificationStore();
export {
  notifications as n
};
