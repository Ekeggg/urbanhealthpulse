const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const createLog = async (data: {
  symptoms: string[];
  severity: number;
  district: string;
  lat: number;
  lng: number;
  notes?: string;
}) => {
  const res = await fetch(`${BASE_URL}/api/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getLogs = async () => {
  const res = await fetch(`${BASE_URL}/api/my-logs`);
  return res.json();
};

export const getCitySummary = async () => {
  const res = await fetch(`${BASE_URL}/api/city-summary`);
  return res.json();
};

export const getPersonalInsights = async () => {
  const res = await fetch(`${BASE_URL}/api/insights/personal`);
  return res.json();
};

export const getCityInsights = async () => {
  const res = await fetch(`${BASE_URL}/api/insights/city`);
  return res.json();
};
