import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerPatient, registerDoctor } from '../../redux/authSlice';
import './AuthPages.css';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'doctor' ? 'DOCTOR' : 'PATIENT';
  const [role, setRole] = useState(initialRole);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      if (role === 'PATIENT') {
        await dispatch(registerPatient(data)).unwrap();
        toast.success('Registration successful! Please login.');
      } else {
        await dispatch(registerDoctor(data)).unwrap();
        toast.success('Registration successful! Your account is pending admin approval.');
      }
      navigate('/login');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span>🏥</span> MediScan <span className="logo-ai">AI</span>
        </Link>
        <div className="auth-left-content">
          <h2>Join MediScan AI</h2>
          <p>Start your health analytics journey today</p>
          <div className="auth-features-list">
            <div className="auth-feature-item">📊 Track Health Metrics</div>
            <div className="auth-feature-item">📝 OCR Report Extraction</div>
            <div className="auth-feature-item">🧠 AI-Powered Insights</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Choose your role and fill in the details</p>

          <div className="role-toggle">
            <button
              className={`role-btn ${role === 'PATIENT' ? 'active' : ''}`}
              onClick={() => { setRole('PATIENT'); reset(); }}
              type="button"
            >
              🧑 Patient
            </button>
            <button
              className={`role-btn ${role === 'DOCTOR' ? 'active' : ''}`}
              onClick={() => { setRole('DOCTOR'); reset(); }}
              type="button"
            >
              👨‍⚕️ Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
              />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            {role === 'PATIENT' && (
              <>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  />
                  {errors.dateOfBirth && <span className="form-error">{errors.dateOfBirth.message}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter your phone number"
                    {...register('phoneNumber', { required: 'Phone number is required' })}
                  />
                  {errors.phoneNumber && <span className="form-error">{errors.phoneNumber.message}</span>}
                </div>
              </>
            )}

            {role === 'DOCTOR' && (
              <>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-select" {...register('specialization', { required: 'Specialization is required' })}>
                    <option value="">Select Specialization</option>
                    <option value="General Practitioner">General Practitioner</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Radiologist">Radiologist</option>
                    <option value="Surgeon">Surgeon</option>
                    <option value="Pathologist">Pathologist</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.specialization && <span className="form-error">{errors.specialization.message}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Years"
                      {...register('experience', { required: 'Required', min: { value: 0, message: 'Invalid' } })}
                    />
                    {errors.experience && <span className="form-error">{errors.experience.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="License #"
                      {...register('licenseNumber', { required: 'License number is required' })}
                    />
                    {errors.licenseNumber && <span className="form-error">{errors.licenseNumber.message}</span>}
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating Account...' : `Register as ${role === 'PATIENT' ? 'Patient' : 'Doctor'}`}
            </button>
          </form>

          {role === 'DOCTOR' && (
            <div className="auth-info-box">
              ℹ️ Doctor accounts require admin approval before accessing the dashboard.
            </div>
          )}

          <div className="auth-footer-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
