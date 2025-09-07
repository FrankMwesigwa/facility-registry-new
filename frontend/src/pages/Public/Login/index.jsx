import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../../helpers/api';
import './styles.css'

const Login = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error("Please enter both username and password.", { position: "top-center" });
            return;
        }

        setLoading(true);
        try {
            const res = await API.post('/auth/login', {
                username: formData.username,
                password: formData.password
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // if (formData.rememberMe) {
            //     localStorage.setItem("rememberMe", "true");
            // }

            toast.success("Login successful!", { position: "top-center" });

            switch (res.data.user.role) {
                case 'admin':
                    history.push('/admin/dashboard');
                    break;
                case 'planning':
                    history.push('/planning/requests');
                    break;
                case 'public':
                    history.push('/requests');
                    break;
                case 'district':
                    history.push('/district/pending/requests');
                    break;
                default:
                    history.push('/');
            }
        } catch (error) {
            toast.error(error.response?.data.message || 'Login failed', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="login-container">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-4">
                        <div class="login-card">
                            <div class="login-header">
                                <h2 class="login-title">Welcome Back</h2>
                                <p class="login-subtitle">Sign in to access the Health Facility Registry</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div class="form-group">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="username"
                                        placeholder="Enter your username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control"
                                        id="password" placeholder="Enter your password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="remember" />
                                    <label class="form-check-label" for="remember" style={{ fontSsize: '0.85rem' }}>
                                        Remember me
                                    </label>
                                </div>

                                <button type="submit" class="btn btn-login">
                                    <i class="fas fa-sign-in-alt me-2"></i>
                                    Sign In
                                </button>
                            </form>

                            <div class="forgot-password">
                                <Link to="/forgot-password">Forgot your password?</Link>
                            </div>

                            <div class="register-link">
                                <p>Don't have an account? <Link to="/register">Register</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login