import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';
import './UserPages.css';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Missing endpoint GET /api/user/health-metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/user/health-metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load health metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const bloodSugarData = metrics?.bloodSugar || [];
  const cholesterolData = metrics?.cholesterol || [];
  const bmiData = metrics?.bmi || [];
  const bpData = metrics?.bloodPressure || [];

  if (loading) return <div style={{ padding: 20 }}>Loading health metrics...</div>;
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Health Metrics</h1>
          <p className="page-subtitle">Track your health trends over time</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">🩸 Blood Sugar Trends</h3>
            <span className="badge badge-success">Improving</span>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bloodSugarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="fasting" stroke="#1FA2FF" strokeWidth={2} dot={{ r: 4 }} name="Fasting" />
                <Line type="monotone" dataKey="postMeal" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} name="Post Meal" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">💊 Cholesterol Trends</h3>
            <span className="badge badge-success">Good</span>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cholesterolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#0F4C81" name="Total" radius={[4,4,0,0]} />
                <Bar dataKey="hdl" fill="#34C759" name="HDL" radius={[4,4,0,0]} />
                <Bar dataKey="ldl" fill="#F59E0B" name="LDL" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">⚖️ BMI Trends</h3>
            <span className="badge badge-info">Stable</span>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[22, 28]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bmi" stroke="#34C759" strokeWidth={2} dot={{ r: 4 }} name="BMI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">❤️ Blood Pressure Trends</h3>
            <span className="badge badge-success">Improving</span>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;
