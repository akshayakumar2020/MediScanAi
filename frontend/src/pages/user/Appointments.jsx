import { useState, useEffect } from 'react';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import { toast } from 'react-toastify';
import './UserPages.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBook, setShowBook] = useState(false);
  const [formData, setFormData] = useState({ doctorId: '', date: '', time: '', reason: '', symptoms: '' });
  const [booking, setBooking] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ id: null, date: '', time: '' });
  const [rescheduling, setRescheduling] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await doctorService.getAll();
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Failed to load doctors", error);
    }
  };

  const fetchSlots = async (doctorId, date) => {
    if (!doctorId || !date) {
      setAvailableSlots([]);
      return;
    }
    try {
      const res = await doctorService.getAvailableSlots(doctorId, date);
      setAvailableSlots(res.data || []);
    } catch (error) {
      console.error("Failed to load slots", error);
      toast.error("Could not load available slots");
    }
  };

const loadAppointments = async () => {
    try {
        const response = await appointmentService.getAll();

        // If your backend returns the array directly
        setAppointments(response.data);

        // If your backend returns:
        // { success: true, data: [...] }
        // then use:
        // setAppointments(response.data.data);

    } catch (error) {
        console.error(error);
        toast.error("Failed to load appointments");
    }
};

const handleCancel = async (id) => {
    try {
        await appointmentService.cancel(id);
        toast.success("Appointment cancelled");
        loadAppointments();
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
        loadAppointments();
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to reschedule");
    } finally {
        setRescheduling(false);
    }
};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage your medical appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBook(true)}>📅 Book Appointment</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--secondary)' }}>
            {appointments.filter(a => a.status && a.status.toUpperCase() === 'SCHEDULED').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Upcoming</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)' }}>
            {appointments.filter(a => a.status === 'Completed').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Completed</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--danger)' }}>
            {appointments.filter(a => a.status === 'Cancelled').length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Cancelled</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.doctorName || a.doctor?.user?.name || 'Unknown Doctor'}</td>
                  <td>{a.doctor?.specialization || a.specialization || 'General'}</td>
                  <td>{new Date(a.appointmentDate || a.date).toLocaleDateString()}</td>
                  <td>{new Date(a.appointmentDate || a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || a.time}</td>
                  <td>
                    <span className={`badge ${a.status && (a.status.toUpperCase() === 'SCHEDULED' || a.status.toUpperCase() === 'PENDING') ? 'badge-info' : a.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status && (a.status.toUpperCase() === 'SCHEDULED' || a.status.toUpperCase() === 'PENDING') && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => {
                          setRescheduleData({ id: a.id, date: '', time: '9:00 AM' });
                          setShowReschedule(true);
                        }}>Reschedule</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBook && (
        <div className="modal-overlay" onClick={() => setShowBook(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Appointment</h3>
              <button className="modal-close" onClick={() => setShowBook(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Select Doctor</label>
              <select className="form-select" value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})}>
                <option value="">Choose a doctor</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.user?.name || 'Dr.'} - {doc.specialization}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={formData.date} onChange={(e) => {
                  setFormData({...formData, date: e.target.value});
                  fetchSlots(formData.doctorId, e.target.value);
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">Available Times</label>
              <select className="form-select" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                <option value="">Select a time</option>
                {availableSlots.length > 0 ? availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                )) : <option value="" disabled>No slots available</option>}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Symptoms (For AI Triage)</label>
              <textarea className="form-input" rows={2} placeholder="Briefly describe your symptoms" value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Reason (Optional)</label>
              <textarea className="form-input" rows={3} placeholder="Describe your reason for visit" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} />
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={booking || !formData.doctorId || !formData.date} onClick={async () => {
              setBooking(true);
              try {
                const dateObj = new Date(`${formData.date}T${formData.time}`);
                await appointmentService.create({
                  doctorId: formData.doctorId,
                  appointmentDate: dateObj.toISOString(),
                  reason: formData.reason,
                  symptoms: formData.symptoms
                });
                setShowBook(false);
                toast.success('Appointment booked!');
                loadAppointments();
                setFormData({ doctorId: '', date: '', time: '', reason: '', symptoms: '' });
                setAvailableSlots([]);
              } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Failed to book appointment');
              } finally {
                setBooking(false);
              }
            }}>
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>             
      )}
      {showReschedule && (
        <div className="modal-overlay" onClick={() => setShowReschedule(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reschedule Appointment</h3>
              <button className="modal-close" onClick={() => setShowReschedule(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">New Date</label>
              <input type="date" className="form-input" value={rescheduleData.date} onChange={(e) => {
                  setRescheduleData({...rescheduleData, date: e.target.value});
                  // For reschedule, we ideally need doctorId from the appointment. 
                  // Assuming we fetch slots similarly if we knew it.
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">New Time</label>
              <input type="time" className="form-input" value={rescheduleData.time} onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})} />
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

export default Appointments;
