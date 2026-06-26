import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getLogs } from '../lib/api';

function severityBadge(severity: number) {
  if (severity >= 7) return 'bg-red-100 text-red-700';
  if (severity >= 4) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
}

export default function MyHealth() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const chartData = [...logs].reverse().map(l => ({
    date: new Date(l.date).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' }),
    severity: l.severity,
  }));

  if (loading) return <div className="text-gray-500 py-12 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Health</h1>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          No logs yet. Head to Log to record your first entry.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Severity over time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="severity"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(log.date).toLocaleDateString('en-SG', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${severityBadge(log.severity)}`}
                  >
                    {log.severity}/10
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {log.symptoms.map((s: string) => (
                    <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">{log.district}</div>
                {log.notes && <div className="text-sm text-gray-600 mt-1">{log.notes}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
