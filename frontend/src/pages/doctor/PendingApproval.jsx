 import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import './DoctorPages.css';

const PendingApproval = () => {
  const dispatch = useDispatch();

  return (
    <div className="pending-status-page">
      <div className="pending-status-icon">⏳</div>
      <h2>Account Pending Approval</h2>
      <p>
        Your doctor account is currently under review by our admin team. 
        You will be able to access the doctor dashboard once your account has been approved.
        This usually takes 1-2 business days.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
        <button className="btn btn-outline" onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </div>
  );
};

export default PendingApproval;
