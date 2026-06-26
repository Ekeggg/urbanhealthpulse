import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getCitySummary } from '../lib/api';

function getColor(avgSeverity: number) {
  if (avgSeverity >= 7) return '#ef4444';
  if (avgSeverity >= 4) return '#f59e0b';
  return '#22c55e';
}

function severityBadge(s: number) {
  if (s >= 7) return 'bg-red-100 text-red-700';
  if (s >= 4) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
}

export default function CityMap() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCitySummary().then(data => {
      setSummaries(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">City Health Map</h1>

      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        style={{ height: 480 }}
      >
        <MapContainer
          center={[1.3521, 103.8198]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {summaries.map(d => (
            <CircleMarker
              key={d.district}
              center={[d.lat, d.lng]}
              radius={Math.min(40, Math.max(10, d.count * 6))}
              fillColor={getColor(d.avgSeverity)}
              fillOpacity={0.65}
              color={getColor(d.avgSeverity)}
              weight={2}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <div className="font-semibold">{d.district}</div>
                  <div>{d.count} reports</div>
                  <div>Avg severity: {d.avgSeverity}/10</div>
                  {d.topSymptoms.length > 0 && (
                    <div>Top: {d.topSymptoms.join(', ')}</div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          Low (1–3)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
          Moderate (4–6)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          High (7–10)
        </div>
        <span className="text-gray-400 ml-2">Circle size = report count</span>
      </div>

      {summaries.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {summaries.map(d => (
            <div key={d.district} className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm text-gray-800">{d.district}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityBadge(d.avgSeverity)}`}>
                  {d.avgSeverity}/10
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {d.count} reports · {d.topSymptoms.slice(0, 2).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {summaries.length === 0 && (
        <div className="text-center text-gray-400 text-sm py-4">
          No city data yet. Log symptoms to populate the map.
        </div>
      )}
    </div>
  );
}
