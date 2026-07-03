import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { loginUser, clearError } from '../../redux/authSlice';
import { getDashboardPath } from '../../utils/roleUtils';
import './AuthPages.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success('Login successful!');
      navigate(getDashboardPath(result.role));
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          <span>🏥</span> MediScan <span className="logo-ai">AI</span>
        </Link>
        <div className="auth-left-content">
          <h2>Welcome back</h2>
          <p>Your health insights are waiting for you</p>
          <div className="auth-features-list">
            <div className="auth-feature-item">🤖 AI-Powered Analysis</div>
            <div className="auth-feature-item">🔒 Secure & Private</div>
            <div className="auth-feature-item">👨‍⚕️ Doctor Network</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
