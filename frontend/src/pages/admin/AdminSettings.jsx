import { toast } from 'react-toastify';

const AdminSettings = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Settings</h1>
          <p className="page-subtitle">Platform configuration and preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, maxWidth: 700 }}>
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>General Settings</h3>
          <div className="form-group">
            <label className="form-label">Platform Name</label>
            <input className="form-input" defaultValue="MediScan AI" />
          </div>
          <div className="form-group">
            <label className="form-label">Support Email</label>
            <input className="form-input" defaultValue="support@mediscan.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Max Upload Size (MB)</label>
            <input type="number" className="form-input" defaultValue={10} />
          </div>
          <button className="btn btn-primary" onClick={() => toast.success('Settings saved!')}>Save Settings</button>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>API Configuration</h3>
          <div className="form-group">
            <label className="form-label">OpenAI API Key</label>
            <input type="password" className="form-input" defaultValue="sk-•••••••••••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">Firebase Project ID</label>
            <input className="form-input" defaultValue="mediscan-ai-prod" />
          </div>
          <div className="form-group">
            <label className="form-label">OCR Language</label>
            <select className="form-select">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => toast.success('API settings updated!')}>Update API Settings</button>
        </div>

        <div className="card" style={{ border: '1px solid var(--danger)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--danger)' }}>Danger Zone</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FEF2F2', borderRadius: 'var(--radius)', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Clear All Reports</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Remove all uploaded reports from the system</div>
            </div>
            <button className="btn btn-danger btn-sm">Clear</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FEF2F2', borderRadius: 'var(--radius)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Reset Database</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Reset all data (cannot be undone)</div>
            </div>
            <button className="btn btn-danger btn-sm">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
