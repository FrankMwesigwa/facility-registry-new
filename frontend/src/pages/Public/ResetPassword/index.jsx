import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../../helpers/api';
import './styles.css';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [passwordReset, setPasswordReset] = useState(false);
    const history = useHistory();
    const { token } = useParams();

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            toast.error("Invalid reset link", { position: "top-center" });
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.password || !formData.confirmPassword) {
            toast.error("Please fill in all fields", { position: "top-center" });
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            toast.error(passwordError, { position: "top-center" });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match", { position: "top-center" });
            return;
        }

        setLoading(true);
        try {
            await API.post(`/auth/resetpassword/${token}`, {
                password: formData.password
            });
            
            setPasswordReset(true);
            toast.success("Password reset successfully!", { position: "top-center" });
        } catch (error) {
            toast.error(error.response?.data.message || 'Error resetting password', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        history.push('/login');
    };

    if (!tokenValid) {
        return (
            <div className="reset-password-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="reset-password-card">
                                <div className="error-icon">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div className="reset-password-header">
                                    <h2 className="reset-password-title">Invalid Link</h2>
                                    <p className="reset-password-subtitle">
                                        This password reset link is invalid or has expired.
                                    </p>
                                </div>
                                <div className="reset-password-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
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

    if (passwordReset) {
        return (
            <div className="reset-password-container">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-4">
                            <div className="reset-password-card">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="reset-password-header">
                                    <h2 className="reset-password-title">Password Reset Successfully!</h2>
                                    <p className="reset-password-subtitle">
                                        Your password has been updated. You can now log in with your new password.
                                    </p>
                                </div>
                                <div className="reset-password-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={handleBackToLogin}
                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Go to Login
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
        <div className="reset-password-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="reset-password-card">
                            <div className="reset-password-header">
                                <h2 className="reset-password-title">Reset Your Password</h2>
                                <p className="reset-password-subtitle">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password"
                                        name="password"
                                        placeholder="Enter your new password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <small className="form-text text-muted">
                                        Password must be at least 6 characters long
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
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
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-key me-2"></i>
                                            Reset Password
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="reset-password-footer">
                                <p>
                                    Remember your password? 
                                    <button 
                                        type="button" 
                                        className="btn-link" 
                                        onClick={handleBackToLogin}
                                    >
                                        Back to Login
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
