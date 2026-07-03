import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import reportService from '../../services/reportService';
import './UserPages.css';

const ReportDetail = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await reportService.getById(id);
        setReport(res.data);
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading report details...</div>;
  if (!report) return <div style={{ padding: 20 }}>Report not found.</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to="/user/reports" className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }}>← Back to Reports</Link>
          <h1 className="page-title">📄 {report.fileName}</h1>
          <p className="page-subtitle">Uploaded on {new Date(report.uploadedAt).toLocaleDateString()}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm">📥 Download</button>
          <button className="btn btn-primary btn-sm">🔄 Re-analyze</button>
        </div>
      </div>

      <div className="report-detail">
        <div className="report-section">
          <h3 className="report-section-title">🔍 OCR Extracted Text</h3>
          <div className="report-text">{report.extractedText || 'No text extracted'}</div>
        </div>

        <div className="report-section">
          <h3 className="report-section-title">🤖 AI Analysis Summary</h3>
          <div className="report-text">{report.aiSummary || 'Analysis pending'}</div>
        </div>

        {/* Findings and Recommendations are extracted from the AI Summary or are empty until supported by backend directly */}
      </div>
    </div>
  );
};

export default ReportDetail;
