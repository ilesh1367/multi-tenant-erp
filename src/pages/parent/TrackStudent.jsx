import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DashboardLayout from "../../components/erp/parent/DashboardLayout";
import { useParent } from "../../context/ParentProvider";

// ─── Fix Leaflet default marker icons broken by Webpack/Vite ───────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom pulsing marker icon
const pulsingIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:36px;height:36px;">
      <div style="
        position:absolute;inset:0;
        background:rgba(59,130,246,0.25);
        border-radius:50%;
        animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:16px;height:16px;
        background:#3b82f6;
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(59,130,246,0.6);
      "></div>
    </div>
    <style>
      @keyframes ping {
        75%,100%{transform:scale(2);opacity:0}
      }
    </style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

// ─── Sub-component: auto-fly to position when it changes ───────────────────
function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 15, { duration: 1.4 });
  }, [position, map]);
  return null;
}

// ─── Demo waypoints simulating a school-bus route ──────────────────────────
const DEMO_WAYPOINTS = [
  { lat: 28.535517, lng: 77.391029, label: "Home" },
  { lat: 28.538004, lng: 77.386421, label: "Rajnagar Chowk" },
  { lat: 28.542167, lng: 77.381905, label: "Sector-5 Stop" },
  { lat: 28.547893, lng: 77.376543, label: "Near School Gate" },
  { lat: 28.550341, lng: 77.371802, label: "School – Arrived" },
];

const STATUS_COLORS = {
  "On the way": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  "At School":  { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  border: "border-green-200"  },
  "Returning":  { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   border: "border-blue-200"   },
};

const TrackStudent = () => {
  const { activeChild } = useParent();
  const studentName = activeChild?.name || "Student";

  const [waypointIdx, setWaypointIdx]   = useState(0);
  const [isTracking, setIsTracking]     = useState(true);
  const [lastUpdated, setLastUpdated]   = useState(new Date());
  const [accuracy]                       = useState(12); // metres (demo)
  const intervalRef                      = useRef(null);

  const position = [
    DEMO_WAYPOINTS[waypointIdx].lat,
    DEMO_WAYPOINTS[waypointIdx].lng,
  ];

  const statusLabel =
    waypointIdx === 0
      ? "At Home"
      : waypointIdx === DEMO_WAYPOINTS.length - 1
      ? "At School"
      : "On the way";

  const statusStyle =
    STATUS_COLORS[statusLabel] ?? STATUS_COLORS["On the way"];

  // Simulate movement every 6 s when tracking is on
  useEffect(() => {
    if (!isTracking) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setWaypointIdx((i) => {
        const next = (i + 1) % DEMO_WAYPOINTS.length;
        setLastUpdated(new Date());
        return next;
      });
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [isTracking]);

  const formatTime = (d) =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <DashboardLayout>
      {/* Inject ping animation globally once */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500 text-3xl">location_on</span>
              Track Student
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Real-time location of <span className="font-semibold text-gray-700 dark:text-gray-300">{studentName}</span>
            </p>
          </div>

          <button
            onClick={() => setIsTracking((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isTracking
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            <span className="material-symbols-outlined text-base">
              {isTracking ? "pause_circle" : "play_circle"}
            </span>
            {isTracking ? "Pause Tracking" : "Resume Tracking"}
          </button>
        </div>

        {/* ── Status cards row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Current status */}
          <div className={`rounded-xl border p-3 ${statusStyle.bg} ${statusStyle.border} dark:bg-opacity-10`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`}></span>
              <span className={`text-sm font-semibold ${statusStyle.text}`}>{statusLabel}</span>
            </div>
          </div>

          {/* Location name */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {DEMO_WAYPOINTS[waypointIdx].label}
            </p>
          </div>

          {/* GPS accuracy */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">GPS Accuracy</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">±{accuracy} m</p>
          </div>

          {/* Last updated */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white tabular-nums">
              {formatTime(lastUpdated)}
            </p>
          </div>
        </div>

        {/* ── Map ── */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-slate-700">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "480px", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Accuracy radius circle */}
            <Circle
              center={position}
              radius={accuracy}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.12, weight: 1 }}
            />

            {/* Student marker */}
            <Marker position={position} icon={pulsingIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">{studentName}</p>
                  <p className="text-gray-500">{DEMO_WAYPOINTS[waypointIdx].label}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Fly smoothly when position changes */}
            <FlyToPosition position={position} />
          </MapContainer>
        </div>

        {/* ── Route progress ── */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Route Progress</h2>
          <ol className="relative ml-2">
            {DEMO_WAYPOINTS.map((wp, i) => {
              const isPast    = i < waypointIdx;
              const isCurrent = i === waypointIdx;
              const isFuture  = i > waypointIdx;
              return (
                <li key={i} className="flex items-start gap-3 pb-5 last:pb-0 relative">
                  {/* Vertical connector */}
                  {i < DEMO_WAYPOINTS.length - 1 && (
                    <div
                      className={`absolute left-[9px] top-5 w-0.5 h-full
                        ${isPast ? "bg-blue-500" : "bg-gray-200 dark:bg-slate-600"}`}
                    />
                  )}

                  {/* Dot */}
                  <div className={`relative z-10 mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isPast    ? "bg-blue-500 border-blue-500" : ""}
                    ${isCurrent ? "bg-white border-blue-500 animate-pulse" : ""}
                    ${isFuture  ? "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-500" : ""}
                  `}>
                    {isPast && (
                      <span className="material-symbols-outlined text-white text-xs">check</span>
                    )}
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                    )}
                  </div>

                  {/* Label */}
                  <div>
                    <p className={`text-sm font-medium
                      ${isPast    ? "text-blue-600 dark:text-blue-400" : ""}
                      ${isCurrent ? "text-gray-900 dark:text-white" : ""}
                      ${isFuture  ? "text-gray-400 dark:text-gray-500" : ""}
                    `}>
                      {wp.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-blue-500 font-medium">← Current location</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
          * Demo mode — location updates every 6 seconds along a simulated route. In production this would reflect the student's real GPS position.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default TrackStudent;