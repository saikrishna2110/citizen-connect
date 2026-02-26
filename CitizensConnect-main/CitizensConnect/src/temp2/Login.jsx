import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield, Users, Code, User } from 'lucide-react';

const Login = ({ onSuccess, onCancel }) => {
  const [activeTab, setActiveTab] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsDeveloper, loginAsPolitician, loginWithAadhar } = useAuth();

  const [formData, setFormData] = useState({
    // Citizen (Aadhar)
    aadharNumber: '',
    otp: '',
    otpSent: false,

    // Developer
    employeeId: '',
    devPassword: '',

    // Politician
    polIdentifier: '',
    polPassword: '',

    // Email login (for registered users)
    email: '',
    password: '',
    isSignUp: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const sendOTP = async () => {
    if (formData.aadharNumber.length !== 12) {
      setError('Please enter a valid 12-digit Aadhar number');
      return;
    }
    // Simulate OTP sending
    setFormData(prev => ({ ...prev, otpSent: true }));
    setError('');
    alert('OTP sent to your registered mobile number');
  };

  const handleCitizenLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginWithAadhar(formData.aadharNumber, formData.otp);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeveloperLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginAsDeveloper(formData.employeeId, formData.devPassword);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePoliticianLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginAsPolitician(formData.polIdentifier, formData.polPassword);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'citizen', label: 'Citizen', icon: User, color: 'bg-blue-500' },
    { id: 'politician', label: 'Politician', icon: Shield, color: 'bg-green-500' },
    { id: 'developer', label: 'Developer', icon: Code, color: 'bg-purple-500' }
  ];

  return (
    <div className="login-modal">
      <div className="login-header">
        <h2 className="login-title">Welcome to CitizensConnect</h2>
        <p className="login-subtitle">Choose your login method</p>
      </div>

      {/* Tab Navigation */}
      <div className="login-tabs">
        {tabs.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`login-tab ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            <div className={`tab-indicator ${color}`}></div>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {/* Citizen Login (Aadhar) */}
      {activeTab === 'citizen' && (
        <form onSubmit={handleCitizenLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Aadhar Number</label>
            <input
              type="text"
              value={formData.aadharNumber}
              onChange={(e) => handleInputChange('aadharNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="Enter 12-digit Aadhar number"
              className="form-input"
              required
            />
          </div>

          {!formData.otpSent ? (
            <button
              type="button"
              onClick={sendOTP}
              className="otp-btn"
              disabled={formData.aadharNumber.length !== 12}
            >
              Send OTP
            </button>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="form-input"
                  required
                />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Login with Aadhar'}
              </button>
            </>
          )}
        </form>
      )}

      {/* Politician Login */}
      {activeTab === 'politician' && (
        <form onSubmit={handlePoliticianLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Politician ID</label>
            <input
              type="text"
              value={formData.polIdentifier}
              onChange={(e) => handleInputChange('polIdentifier', e.target.value)}
              placeholder="e.g., NarendraModi, RahulGandhi, ArvindKejriwal"
              className="form-input"
              required
            />
            <small className="form-hint">Available: NarendraModi, RahulGandhi, ArvindKejriwal, MamataBanerjee, YogiAdityanath, etc.</small>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.polPassword}
                onChange={(e) => handleInputChange('polPassword', e.target.value)}
                placeholder="Enter password"
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Politician'}
          </button>
        </form>
      )}

      {/* Developer Login */}
      {activeTab === 'developer' && (
        <form onSubmit={handleDeveloperLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              placeholder="e.g., DEV001, DEV002, DEV003"
              className="form-input"
              required
            />
            <small className="form-hint">Available: DEV001 to DEV008</small>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.devPassword}
                onChange={(e) => handleInputChange('devPassword', e.target.value)}
                placeholder="Enter password"
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Developer'}
          </button>
        </form>
      )}

      <div className="login-footer">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Login;
