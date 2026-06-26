import { useState } from 'react';
import { SYMPTOMS, DISTRICTS } from '../lib/constants';
import { createLog } from '../lib/api';

export default function Log() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [district, setDistrict] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSymptom = (s: string) =>
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  const handleSubmit = async () => {
    if (!district || selectedSymptoms.length === 0) return;
    setLoading(true);
    const districtData = DISTRICTS.find(d => d.name === district)!;
    await createLog({
      symptoms: selectedSymptoms,
      severity,
      district,
      lat: districtData.lat,
      lng: districtData.lng,
      notes,
    });
    setLoading(false);
    setSuccess(true);
    setSelectedSymptoms([]);
    setSeverity(5);
    setNotes('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Log Today's Symptoms</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Symptom picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Symptoms <span className="text-gray-400 font-normal">(select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedSymptoms.includes(s)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Severity slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity:{' '}
            <span className="text-blue-600 font-bold">{severity}/10</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={severity}
            onChange={e => setSeverity(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your District</label>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select district...</option>
            {DISTRICTS.map(d => (
              <option key={d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any additional context..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !district || selectedSymptoms.length === 0}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Logging...' : 'Log Symptoms'}
        </button>

        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">
            ✓ Symptoms logged successfully
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Your data is anonymized and contributes to city-wide health monitoring.
      </p>
    </div>
  );
}
