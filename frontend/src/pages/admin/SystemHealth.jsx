import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';

const HEALTH_CHECK_MAP = {
  apiStatus: { name: 'API Server', icon: '🌐', detail: 'Backend REST endpoints' },
  databaseStatus: { name: 'PostgreSQL Database', icon: '🗄️', detail: 'Database connection pool' },
  ocrStatus: { name: 'OCR Service (Tess4J)', icon: '🔍', detail: 'Text extraction service' },
  firebaseStatus: { name: 'Firebase Storage', icon: '☁️', detail: 'Cloud file storage' },
  aiStatus: { name: 'AI Analysis (Spring AI)', icon: '🤖', detail: 'AI report analysis' },
  jwtStatus: { name: 'JWT Authentication', icon: '🔐', detail: 'Security & session management' },
};

const SystemHealth = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemHealth();
  }, []);

  const loadSystemHealth = async () => {
    try {
      const response = await adminService.getSystemHealth();
      setHealthData(response.data);
    } catch (error) {
      console.error('Failed to load system health', error);
      toast.error('Unable to load system health');
    } finally {
      setLoading(false);
    }
  };

  const healthChecks = healthData
    ? Object.entries(HEALTH_CHECK_MAP).map(([key, meta]) => ({
        ...meta,
        status: healthData[key] === 'UP' ? 'healthy' : healthData[key] === 'DEGRADED' ? 'warning' : 'down',
      }))
    : [];

  const allHealthy = healthChecks.length > 0 && healthChecks.every(h => h.status === 'healthy');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, fontSize: 16, color: 'var(--text-light)' }}>
        Loading system health...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Health</h1>
          <p className="page-subtitle">Monitor system status and performance</p>
        </div>
        <div className={`badge ${allHealthy ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 16px', fontSize: 14 }}>
          {allHealthy ? '✅ All Systems Operational' : '⚠️ Some Issues Detected'}
        </div>
      </div>

      <div className="system-health-grid">
        {healthChecks.map((h, i) => (
          <div className="health-check-card" key={i}>
            <div className={`health-check-icon ${h.status}`}>
              {h.icon}
            </div>
            <div className="health-check-info">
              <div className="health-check-name">{h.name}</div>
              <div className={`health-check-status ${h.status}`}>
                {h.status === 'healthy' ? '● Operational' : h.status === 'warning' ? '● Degraded' : '● Down'}
              </div>
              <div className="health-check-latency">{h.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 className="card-title" style={{ marginBottom: 16 }}>System Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {[
            { label: 'Backend', value: 'Spring Boot 3.x / Java 21' },
            { label: 'Frontend', value: 'React.js (Vite)' },
            { label: 'Database', value: 'PostgreSQL 16' },
            { label: 'Storage', value: 'Firebase Storage' },
            { label: 'OCR Engine', value: 'Tess4J + Apache PDFBox' },
            { label: 'AI Provider', value: 'Spring AI / OpenAI GPT-4' },
            { label: 'Authentication', value: 'JWT + Spring Security' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{item.label}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
