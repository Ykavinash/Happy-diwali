// Checklist logic + LocalStorage persistence
const Checklist = (() => {
  const STORAGE_KEY = "diwaliTravelTasks_v1";
  const defaults = [
    { text: "Pack festive outfits & comfortable clothes", done: false },
    { text: "Keep tickets, ID & wallet together", done: false },
    { text: "Pack charger, earphones & power bank", done: false },
    { text: "Buy sweets / gifts for family", done: false },
    { text: "Pack toiletries & daily essentials", done: false },
    { text: "Water plants / tidy up before leaving", done: false },
    { text: "Check travel time and route", done: false },
    { text: "Tell family when I’m leaving", done: false }
  ];
  let tasks = load();
  function load() {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) ? saved : defaults; }
    catch { return defaults; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  function getTasks() { return tasks; }
  function add(text) { tasks.push({ text, done:false }); save(); }
  function toggle(index) { tasks[index].done = !tasks[index].done; save(); }
  function remove(index) { tasks.splice(index,1); save(); }
  function reset() { tasks = defaults.map(t => ({...t})); save(); }
  return { getTasks, add, toggle, remove, reset };
})();