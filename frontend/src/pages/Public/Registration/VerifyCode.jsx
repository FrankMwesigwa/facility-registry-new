import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../../helpers/api';
import './VerifyCode.css';

const VerifyCode = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        history.replace('/register');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await API.post('/auth/verifycode', { code: verificationCode });
            toast.success('Email verified successfully!', { position: "top-center" });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            history.push('/login');
        } catch (error) {
            toast.error(error.response?.data.message || 'Error verifying code', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-page">
            {/* Header */}
            <header className="verify-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="logo">
                            <div className="coat-of-arms">
                                <div className="arms-circle">
                                    <div className="arms-inner">
                                        <div className="arms-center"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="brand-text">
                                <div className="ministry-text">Ministry of Health</div>
                                <div className="registry-text">National Health Facility Registry</div>
                            </div>
                        </div>
                    </div>
                    <nav className="header-nav">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/mfl" className="nav-link">MFL</a>
                        <div className="nav-dropdown">
                            <a href="/downloads" className="nav-link">Downloads <span className="dropdown-arrow">▼</span></a>
                        </div>
                        <a href="/manuals" className="nav-link">SOPs & Manuals</a>
                        <a href="/api-docs" className="nav-link">API Docs</a>
                    </nav>
                    <div className="header-actions">
                        <a href="/register" className="btn-outline">Create Account</a>
                        <a href="/login" className="btn-primary">Login</a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="verify-main">
                <div className="verify-container">
                    <div className="verify-card">
                        <h1 className="verify-title">Verify Your Email</h1>
                        <p className="verify-description">
                            Please enter the verification code sent to your email address: <strong>{email}</strong>
                        </p>
                        
                        <form onSubmit={handleSubmit} className="verify-form">
                            <div className="input-container">
                                <div className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="verify-input"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <button type="submit" className="verify-button" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="verify-footer">
                <div className="footer-content">
                    <p>&copy; 2025 Ministry of Health, Uganda. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default VerifyCode;