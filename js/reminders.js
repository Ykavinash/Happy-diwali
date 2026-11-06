// Friendly browser reminders. Browsers require permission and the page to remain open.
const Reminders = {
  async requestPermission() {
    if (!("Notification" in window)) return "unsupported";
    return await Notification.requestPermission();
  },
  notify(title, body) {
    if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body });
    else alert(`${title}\n${body}`);
  }
};