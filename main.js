let points = [];
try { points = JSON.parse(localStorage.getItem("points")) || []; } catch (e) {}
let watchId = null;
let lastTs = 0;

const stations = [
  "Malahide",
  "Portmarnock",
  "Clongriffin",
  "Howth Junction & Donaghmede",
  "Howth",
  "Sutton",
  "Bayside",
  "Kilbarrack",
  "Raheny",
  "Harmonstown",
  "Killester",
  "Clontarf Road",
  "Dublin Connolly",
  "Tara Street",
  "Dublin Pearse",
  "Grand Canal Dock",
  "Lansdowne Road",
  "Sandymount",
  "Sydney Parade",
  "Booterstown",
  "Blackrock",
  "Seapoint",
  "Salthill & Monkstown",
  "Dun Laoghaire",
  "Sandycove & Glasthule",
  "Glenageary",
  "Dalkey",
  "Killiney",
  "Shankill",
  "Woodbrook",
  "Bray",
  "Greystones"
];

const fromDropdown = document.querySelector("#fromStation");
const toDropdown = document.querySelector("#toStation");

for (const station of stations) {
  fromDropdown.add(new Option(station, station));
  toDropdown.add(new Option(station, station));
}
document.getElementById("count").textContent = points.length;

function save() {
  try { localStorage.setItem("points", JSON.stringify(points)); }
  catch (e) { document.getElementById("msg").textContent = "Phone storage full - download the CSV now."; }
}

function onPosition(pos) {
  const c = pos.coords;
  document.getElementById("speed").textContent = c.speed == null ? "--" : (c.speed * 3.6).toFixed(0);
  document.getElementById("acc").textContent = Math.round(c.accuracy) + " m";

  if (pos.timestamp - lastTs < document.getElementById("interval").value * 1000) return;
  lastTs = pos.timestamp;
  points.push({
    time: new Date(pos.timestamp).toISOString(),
    route: document.getElementById("route").value,
    lat: c.latitude,
    lon: c.longitude,
    accuracy_m: c.accuracy,
    speed_mps: c.speed,
  });
  save();
  document.getElementById("count").textContent = points.length;
}

document.getElementById("start").onclick = () => {
  if (!navigator.geolocation) { document.getElementById("msg").textContent = "No geolocation in this browser."; return; }
  watchId = navigator.geolocation.watchPosition(onPosition,
    (err) => { document.getElementById("msg").textContent = "GPS error: " + err.message; },
    { enableHighAccuracy: true, maximumAge: 0 });
  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
  document.getElementById("msg").textContent = "Recording - keep the screen on.";
};

document.getElementById("stop").onclick = () => {
  navigator.geolocation.clearWatch(watchId);
  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
  document.getElementById("msg").textContent = "Stopped.";
};

document.getElementById("download").onclick = () => {
  const cols = ["time", "route", "lat", "lon", "accuracy_m", "speed_mps"];
  const lines = [cols.join(",")].concat(
    points.map((p) => cols.map((k) => (p[k] == null ? "" : `"document.getElementById{String(p[k]).replace(/"/g, '""')}"`)).join(","))
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
  a.download = "gps_" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".csv";
  a.click();
};

document.getElementById("clear").onclick = () => {
  if (!confirm("Delete all saved points? Download the CSV first.")) return;
  points = [];
  save();
  document.getElementById("count").textContent = 0;
};