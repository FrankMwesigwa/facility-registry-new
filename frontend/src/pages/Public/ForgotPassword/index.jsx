import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../../helpers/api';
import './styles.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Please enter your email address.", { position: "top-center" });
            return;
        }

        setLoading(true);
        try {
            await API.post('/auth/forgotpassword', { email });
            setEmailSent(true);
            toast.success("Password reset link sent to your email!", { position: "top-center" });
        } catch (error) {
            toast.error(error.response?.data.message || 'Error sending reset link', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        history.push('/login');
    };

    if (emailSent) {
        return (
            <div className="forgot-password-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="forgot-password-card">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="forgot-password-header">
                                    <h2 className="forgot-password-title">Check Your Email</h2>
                                    <p className="forgot-password-subtitle">
                                        We've sent a password reset link to <strong>{email}</strong>
                                    </p>
                                </div>

                                <div className="email-instructions">
                                    <p>Please check your email and click the reset password link to continue.</p>
                                    <p className="text-muted">
                                        <small>
                                            Didn't receive the email? Check your spam folder or 
                                            <button 
                                                type="button" 
                                                className="btn-link" 
                                                onClick={() => setEmailSent(false)}
                                            >
                                                try again
                                            </button>
                                        </small>
                                    </p>
                                </div>

                                <div className="forgot-password-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={handleBackToLogin}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="forgot-password-card">
                            <div className="forgot-password-header">
                                <h2 className="forgot-password-title">Forgot Password?</h2>
                                <p className="forgot-password-subtitle">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="forgot-password-footer">
                                <p>
                                    Remember your password? 
                                    <Link to="/login" className="ms-1">Back to Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
