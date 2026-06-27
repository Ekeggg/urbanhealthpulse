import { useState } from 'react';
import { getPersonalInsights, getCityInsights } from '../lib/api';

const alertStyles = {
  low: 'bg-green-50 border-green-200 text-green-800',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  high: 'bg-red-50 border-red-200 text-red-800',
};

export default function Insights() {
  const [personalData, setPersonalData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  const fetchPersonal = async () => {
    setLoadingPersonal(true);
    const data = await getPersonalInsights();
    console.log('personal data:', data);
    setPersonalData(data);
    setLoadingPersonal(false);
  };

  const fetchCity = async () => {
    setLoadingCity(true);
    const data = await getCityInsights();
    setCityData(data);
    setLoadingCity(false);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>

      {/* Personal */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Your Health</h2>
          <button
            onClick={fetchPersonal}
            disabled={loadingPersonal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loadingPersonal ? 'Analyzing...' : 'Analyze My Logs'}
          </button>
        </div>

        {personalData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <p className="text-gray-700">{personalData.summary}</p>

            {personalData.patterns?.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Patterns</h3>
                <ul className="space-y-1.5">
                  {personalData.patterns.map((p: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500 mt-0.5">→</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {personalData.flags?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-yellow-700 mb-2">Worth noting</h3>
                <ul className="space-y-1">
                  {personalData.flags.map((f: string, i: number) => (
                    <li key={i} className="text-sm text-yellow-800 flex gap-2">
                      <span>⚠</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-700">{personalData.advice}</p>
            </div>
          </div>
        )}
      </section>

      {/* City-wide */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">City-Wide Analysis</h2>
          <button
            onClick={fetchCity}
            disabled={loadingCity}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loadingCity ? 'Analyzing...' : 'Analyze City Data'}
          </button>
        </div>

        {cityData && (
          <div className="space-y-4">
            {/* Alert banner */}
            <div className={`rounded-xl border p-5 ${alertStyles[cityData.alert_level as keyof typeof alertStyles]}`}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1">
                Alert Level: {cityData.alert_level}
              </div>
              <p className="text-sm">{cityData.summary}</p>
            </div>

            {cityData.hotspots?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Hotspot Districts</h3>
                <div className="space-y-2">
                  {cityData.hotspots.map((h: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="font-medium text-gray-800 w-28 shrink-0">{h.district}</span>
                      <span className="text-gray-600">{h.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cityData.trends?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Trends</h3>
                <ul className="space-y-1.5">
                  {cityData.trends.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500 mt-0.5">→</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {cityData.recommendations?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Recommendations for city health authorities
                </h3>
                <ul className="space-y-1.5">
                  {cityData.recommendations.map((r: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
