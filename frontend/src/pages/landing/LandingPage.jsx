import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import './LandingPage.css';

const features = [
  { icon: '🤖', title: 'AI Report Analysis', desc: 'Advanced AI algorithms analyze your medical reports to extract meaningful health insights and risk indicators.' },
  { icon: '📝', title: 'OCR Powered Extraction', desc: 'State-of-the-art OCR technology extracts text from PDF and image reports with high accuracy.' },
  { icon: '🔒', title: 'Secure Cloud Storage', desc: 'All your medical reports are securely stored in encrypted cloud storage with HIPAA compliance.' },
  { icon: '👨‍⚕️', title: 'Connect With Doctors', desc: 'Find and connect with verified healthcare professionals for expert medical opinions.' },
  { icon: '📅', title: 'Appointment Booking', desc: 'Schedule appointments with doctors seamlessly and manage your healthcare calendar.' },
  { icon: '📊', title: 'Health Trends Dashboard', desc: 'Track blood sugar, cholesterol, BMI, blood pressure and more with interactive charts.' },
];

const steps = [
  { num: '01', icon: '📤', title: 'Upload Report', desc: 'Upload your medical reports in PDF, JPG or PNG format through our secure portal.' },
  { num: '02', icon: '🔍', title: 'OCR Extracts Text', desc: 'Our OCR engine accurately extracts text and data from your uploaded medical documents.' },
  { num: '03', icon: '🧠', title: 'AI Generates Insights', desc: 'AI analyzes extracted data to provide summaries, key findings, and health recommendations.' },
  { num: '04', icon: '✅', title: 'Doctor Reviews Report', desc: 'Verified doctors review AI analysis, add diagnosis notes and personalized guidance.' },
];

const testimonials = [
  { name: 'Dr. Sarah Chen', role: 'Cardiologist', text: 'MediScan AI has transformed how I review patient reports. The AI summaries save me hours every week while maintaining accuracy.', avatar: 'SC' },
  { name: 'James Wilson', role: 'Patient', text: 'Finally a platform that helps me understand my lab reports. The health trends dashboard is incredibly useful for tracking my progress.', avatar: 'JW' },
  { name: 'Dr. Priya Patel', role: 'General Practitioner', text: 'The OCR accuracy is impressive. I can now digitize and analyze patient records in minutes instead of hours.', avatar: 'PP' },
];

const pricingPlans = [
  {
    name: 'Basic', price: 'Free', period: 'forever', desc: 'For individuals getting started',
    features: ['5 Report Uploads/month', 'Basic AI Analysis', 'Health Dashboard', 'Email Support'],
    cta: 'Get Started', popular: false,
  },
  {
    name: 'Professional', price: '$29', period: '/month', desc: 'For regular health tracking',
    features: ['Unlimited Uploads', 'Advanced AI Analysis', 'Doctor Consultations', 'Priority Support', 'Health Trends', 'Export Reports'],
    cta: 'Start Free Trial', popular: true,
  },
  {
    name: 'Enterprise', price: '$99', period: '/month', desc: 'For clinics and hospitals',
    features: ['Everything in Pro', 'Multi-user Access', 'API Integration', 'Custom Branding', 'Dedicated Support', 'SLA Guarantee', 'HIPAA Compliance'],
    cta: 'Contact Sales', popular: false,
  },
];

const faqs = [
  { q: 'How does MediScan AI analyze my reports?', a: 'MediScan AI uses OCR technology to extract text from your uploaded reports, then leverages advanced AI models to analyze the data, identify key findings, risk indicators, and provide actionable health recommendations.' },
  { q: 'Is my medical data secure?', a: 'Absolutely. We use enterprise-grade encryption, secure cloud storage, and follow HIPAA compliance guidelines. Your data is never shared with third parties without your explicit consent.' },
  { q: 'What file formats are supported?', a: 'We support PDF, JPG, JPEG, and PNG formats. You can upload lab reports, prescriptions, medical imaging reports, and other healthcare documents.' },
  { q: 'Can I consult with real doctors?', a: 'Yes! Our platform connects you with verified, licensed healthcare professionals who can review your AI-analyzed reports and provide personalized medical guidance.' },
  { q: 'How accurate is the AI analysis?', a: 'Our AI models are trained on millions of medical documents and achieve high accuracy rates. However, AI analysis is meant to supplement, not replace, professional medical advice.' },
];

const LandingPage = () => {
  return (
    <div className="landing">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-circles">
            <div className="circle c1" />
            <div className="circle c2" />
            <div className="circle c3" />
          </div>
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🚀 AI-Powered Healthcare Analytics Platform</div>
          <h1 className="hero-title">
            Understand Your Health<br />Reports <span className="gradient-text">Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Upload reports, extract medical insights using OCR and AI, track health metrics,
            and connect with doctors securely.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-xl">
              📤 Upload Report
            </Link>
            <button className="btn btn-outline btn-xl" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              ▶ Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">50K+</div>
              <div className="hero-stat-label">Reports Analyzed</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">2,000+</div>
              <div className="hero-stat-label">Verified Doctors</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">99.2%</div>
              <div className="hero-stat-label">OCR Accuracy</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">4.9★</div>
              <div className="hero-stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything you need to manage your health</h2>
            <p className="section-subtitle">Powerful tools designed to help you understand, track, and improve your health outcomes.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">How It Works</div>
            <h2 className="section-title">Simple 4-step process to health insights</h2>
            <p className="section-subtitle">From upload to expert review, we make understanding your health effortless.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Doctors */}
      <section className="section" id="doctors">
        <div className="container">
          <div className="doctors-section">
            <div className="doctors-content">
              <div className="section-badge">For Doctors</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Streamline your practice with AI</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', maxWidth: 'none' }}>
                Join our network of healthcare professionals and leverage AI to enhance patient care.
              </p>
              <ul className="doctors-features">
                <li>✅ AI-powered report pre-analysis saves hours</li>
                <li>✅ Digital patient management dashboard</li>
                <li>✅ Secure consultation platform</li>
                <li>✅ Automated appointment scheduling</li>
                <li>✅ Comprehensive patient health history</li>
                <li>✅ Diagnosis and notes management</li>
              </ul>
              <Link to="/register?role=doctor" className="btn btn-primary btn-lg">Join as Doctor →</Link>
            </div>
            <div className="doctors-visual">
              <div className="doctor-card-preview">
                <div className="dcp-header">
                  <div className="dcp-avatar">👨‍⚕️</div>
                  <div>
                    <div className="dcp-name">Doctor Dashboard</div>
                    <div className="dcp-role">MediScan AI Platform</div>
                  </div>
                </div>
                <div className="dcp-stats">
                  <div className="dcp-stat"><span>24</span> Patients</div>
                  <div className="dcp-stat"><span>8</span> Pending</div>
                  <div className="dcp-stat"><span>12</span> Today</div>
                </div>
                <div className="dcp-bar"><div className="dcp-bar-fill" style={{ width: '78%' }} /></div>
                <div className="dcp-text">Report analysis progress: 78%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">Trusted by healthcare professionals</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Pricing</div>
            <h2 className="section-title">Simple, transparent pricing</h2>
            <p className="section-subtitle">Choose the plan that fits your needs. No hidden fees.</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((p, i) => (
              <div className={`pricing-card ${p.popular ? 'popular' : ''}`} key={i}>
                {p.popular && <div className="pricing-badge">Most Popular</div>}
                <h3 className="pricing-name">{p.name}</h3>
                <p className="pricing-desc">{p.desc}</p>
                <div className="pricing-price">
                  <span className="pricing-amount">{p.price}</span>
                  <span className="pricing-period">{p.period}</span>
                </div>
                <ul className="pricing-features">
                  {p.features.map((f, j) => (
                    <li key={j}>✓ {f}</li>
                  ))}
                </ul>
                <Link to="/register" className={`btn ${p.popular ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">FAQ</div>
            <h2 className="section-title">Frequently asked questions</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <details className="faq-item" key={i}>
                <summary className="faq-question">{faq.q}</summary>
                <p className="faq-answer">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to understand your health better?</h2>
            <p className="cta-subtitle">Join thousands of users who trust MediScan AI for their health report analysis.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent btn-xl">Get Started Free</Link>
              <Link to="/register?role=doctor" className="btn btn-outline btn-xl" style={{ borderColor: 'white', color: 'white' }}>Join as Doctor</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span>🏥</span> MediScan <span className="logo-ai">AI</span>
              </div>
              <p className="footer-desc">AI-powered healthcare analytics platform for patients and doctors.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Status</a>
              <a href="#">API Docs</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 MediScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
