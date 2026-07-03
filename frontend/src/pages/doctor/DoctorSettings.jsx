import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import doctorService from '../../services/doctorService';

const DoctorSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const handleMarkLeave = async () => {
    if (!leaveDate) return;
    try {
      await doctorService.markLeave(user.doctorId, { leaveDate, reason: leaveReason });
      toast.success("Leave marked successfully! Appointments cancelled.");
      setLeaveDate('');
      setLeaveReason('');
    } catch (e) {
      toast.error("Failed to mark leave");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your professional profile</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Profile Information</h3>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" defaultValue={user?.name || ''} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" defaultValue={user?.email || ''} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="form-group">
          <label className="form-label">Specialization</label>
          <input className="form-input" placeholder="Your specialization" />
        </div>
        <div className="form-group">
          <label className="form-label">Experience (years)</label>
          <input type="number" className="form-input" placeholder="Years of experience" />
        </div>
        <div className="form-group">
          <label className="form-label">License Number</label>
          <input className="form-input" placeholder="Medical license number" />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-input" rows={4} placeholder="Professional biography" />
        </div>
        <button className="btn btn-primary" onClick={() => toast.success('Profile updated!')}>Save Changes</button>
      </div>

      <div className="card" style={{ maxWidth: 600, marginTop: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Integrations</h3>
        <button 
          className="btn btn-outline" 
          onClick={() => window.location.href = 'http://localhost:8080/api/google/auth'}
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" style={{ width: 20, height: 20 }}/>
          Connect Google Calendar
        </button>
      </div>

      <div className="card" style={{ maxWidth: 600, marginTop: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Leave Management</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: 15 }}>Marking a day as leave will automatically cancel all scheduled appointments for that day and notify the patients.</p>
        <div className="form-group">
          <label className="form-label">Leave Date</label>
          <input type="date" className="form-input" value={leaveDate} onChange={e => setLeaveDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Reason (Optional)</label>
          <input className="form-input" placeholder="e.g. Sick Leave, Vacation" value={leaveReason} onChange={e => setLeaveReason(e.target.value)} />
        </div>
        <button className="btn btn-danger" onClick={handleMarkLeave}>Mark Leave Day</button>
      </div>
    </div>
  );
};

export default DoctorSettings;
