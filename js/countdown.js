// Countdown date can be changed from the page.
const Countdown = (() => {
  let target = localStorage.getItem("diwaliTravelDate") || "2026-11-08T00:00:00";
  function setDate(value) { target = value; localStorage.setItem("diwaliTravelDate", value); }
  function getDate() { return target; }
  function parts() {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { ended:true, days:0, hours:0, minutes:0, seconds:0 };
    return { ended:false, days:Math.floor(diff/86400000), hours:Math.floor(diff/3600000)%24, minutes:Math.floor(diff/60000)%60, seconds:Math.floor(diff/1000)%60 };
  }
  return { setDate, getDate, parts };
})();