import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Log from './pages/Log';
import MyHealth from './pages/MyHealth';
import CityMap from './pages/CityMap';
import Insights from './pages/Insights';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-8 sticky top-0 z-50">
          <span className="font-bold text-blue-600 text-lg">Urban Health Pulse</span>
          {[
            { to: '/log', label: 'Log' },
            { to: '/my-health', label: 'My Health' },
            { to: '/city-map', label: 'City Map' },
            { to: '/insights', label: 'Insights' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 font-medium text-sm'
                  : 'text-gray-500 hover:text-gray-800 text-sm transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="max-w-3xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Log />} />
            <Route path="/log" element={<Log />} />
            <Route path="/my-health" element={<MyHealth />} />
            <Route path="/city-map" element={<CityMap />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
