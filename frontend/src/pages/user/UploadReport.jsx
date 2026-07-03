import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadReport } from '../../redux/reportSlice';
import { toast } from 'react-toastify';
import './UserPages.css';

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

  const handleFile = (f) => {
    if (!f) return;
    if (!allowedTypes.includes(f.type)) {
      toast.error('Only PDF, JPG, JPEG, PNG files are supported');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);
      await dispatch(uploadReport(formData)).unwrap();
      setProgress(100);
      toast.success('Report uploaded and analyzed successfully!');
      setTimeout(() => navigate('/user/reports'), 1000);
    } catch (err) {
      toast.error('Upload failed. Please try again.');
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload Report</h1>
          <p className="page-subtitle">Upload medical reports for AI analysis and OCR extraction</p>
        </div>
      </div>

      <div className="card">
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="upload-zone-icon">📤</div>
          <div className="upload-zone-title">Drag & Drop your report here</div>
          <div className="upload-zone-text">or click to browse files</div>
          <div className="upload-zone-formats">Supported: PDF, JPG, JPEG, PNG (Max 10MB)</div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="upload-preview">
            <div className="upload-file-item">
              <div className="upload-file-icon">{file.type === 'application/pdf' ? '📕' : '🖼️'}</div>
              <div className="upload-file-info">
                <div className="upload-file-name">{file.name}</div>
                <div className="upload-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                {uploading && (
                  <div className="upload-progress">
                    <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
              {!uploading && (
                <button className="btn btn-ghost btn-sm" onClick={() => { setFile(null); setPreview(null); }}>✕</button>
              )}
            </div>

            {preview && (
              <div style={{ marginTop: 16, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={preview} alt="Preview" style={{ maxHeight: 300, width: '100%', objectFit: 'contain', background: '#f8f8f8' }} />
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? `Uploading... ${progress}%` : '🚀 Upload & Analyze'}
              </button>
              {!uploading && (
                <button className="btn btn-ghost btn-lg" onClick={() => { setFile(null); setPreview(null); }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>OCR Extraction</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Text extracted from your report using advanced OCR</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>AI Analysis</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>AI generates summary, findings, and recommendations</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>👨‍⚕️</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Doctor Review</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)' }}>Doctors can review and add professional notes</div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
