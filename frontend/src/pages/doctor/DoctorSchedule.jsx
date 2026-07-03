import { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import { toast } from 'react-toastify';
import './DoctorPages.css';

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ id: null, date: '', time: '9:00 AM' });
  const [rescheduling, setRescheduling] = useState(false);

  const fetchSchedule = async () => {
    try {
      const res = await appointmentService.getAll();
      setSchedule(res.data || []);
    } catch (err) {
      console.error("Failed to load schedule", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleCancel = async (id) => {
    try {
        await appointmentService.cancel(id);
        toast.success("Appointment cancelled");
        fetchSchedule();
    } catch (error) {
        console.error(error);
        toast.error("Unable to cancel appointment");
    }
  };

  const handleRescheduleSubmit = async () => {
    setRescheduling(true);
    try {
        const dateObj = new Date(`${rescheduleData.date} ${rescheduleData.time}`);
        await appointmentService.reschedule(rescheduleData.id, {
            newAppointmentDate: dateObj.toISOString()
        });
        setShowReschedule(false);
        toast.success("Appointment rescheduled successfully");
        fetchSchedule();
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to reschedule");
    } finally {
        setRescheduling(false);
    }
  };

  const todaySchedule = schedule; // Filtering logic can be added here if needed
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Today's Schedule</h1>
          <p className="page-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>
            {todaySchedule.filter(s => s.status === 'Completed').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Completed</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--secondary)' }}>
            {todaySchedule.filter(s => s.status === 'In Progress').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>In Progress</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--warning)' }}>
            {todaySchedule.filter(s => s.status === 'Upcoming').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Upcoming</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 20 }}>📅 Schedule</h3>
        <div className="schedule-grid">
          {todaySchedule.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>No appointments scheduled for today</div>
          )}
          {todaySchedule.map(s => (
            <div className="schedule-item" key={s.id}>
              <div className="schedule-time">
                <div className="schedule-time-value">{new Date(s.appointmentDate || s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || s.time}</div>
              </div>
              <div className="schedule-patient">
                <div className="schedule-patient-name">{s.patientName || s.patient?.user?.name || s.patient || 'Patient'}</div>
                <div className="schedule-patient-reason">{s.reason || 'Consultation'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className={`badge ${s.status === 'Completed' ? 'badge-success' : (s.status && (s.status.toUpperCase() === 'SCHEDULED' || s.status.toUpperCase() === 'PENDING')) ? 'badge-warning' : 'badge-info'}`}>
                  {s.status}
                </span>
                {s.status && (s.status.toUpperCase() === 'SCHEDULED' || s.status.toUpperCase() === 'PENDING') && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      setRescheduleData({ id: s.id, date: '', time: '9:00 AM' });
                      setShowReschedule(true);
                    }}>Reschedule</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(s.id)}>Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showReschedule && (
        <div className="modal-overlay" onClick={() => setShowReschedule(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reschedule Appointment</h3>
              <button className="modal-close" onClick={() => setShowReschedule(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">New Date</label>
              <input type="date" className="form-input" value={rescheduleData.date} onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">New Time</label>
              <select className="form-select" value={rescheduleData.time} onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}>
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
                <option>4:00 PM</option>
              </select>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={rescheduling || !rescheduleData.date} onClick={handleRescheduleSubmit}>
              {rescheduling ? 'Rescheduling...' : 'Confirm New Time'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule;
