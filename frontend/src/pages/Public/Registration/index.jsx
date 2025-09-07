import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from "react-select";
import API from "../../../helpers/api";
import './styles.css'

const Registration = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phoneno: '',
        district_id: '',
        username: '',
        organisation: ''
    });

    const [loading, setLoading] = useState(false);
    const [districtOptions, setDistrictOptions] = useState([]);

    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await API.get(`/adminunits/districts`);
                console.log('Districts Data:', response.data);
                
                // Map districts to react-select format
                const options = response.data.map(district => ({
                    value: district.id,
                    label: district.name
                }));
                setDistrictOptions(options);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching districts:', err);
                setLoading(false);
            }
        };

        fetchDistricts();
    }, []);

    const handleDistrictChange = (selectedOption) => {
        setFormData({ ...formData, district_id: selectedOption ? selectedOption.value : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await API.post('/auth/register/public', formData);
            toast.success(response.data.message || 'Registration successful! Please check your email for verification code.', { position: "top-center" });
            history.push('/verify', { email: formData.email });
        } catch (error) {
            toast.error(error.response?.data.message || 'Error registering user', { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div class="register-container">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-7">
                        <div class="register-card">
                            <div class="register-header">
                                <h2 class="register-title">Create Account</h2>
                                <p class="register-subtitle">Join the National Health Facility Registry</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="firstName" class="form-label">First Name</label>
                                            <input type="text" class="form-control" id="firstName"
                                                placeholder="Enter first name"
                                                name="firstname"
                                                value={formData.firstname}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div class="form-group">
                                            <label for="text" class="form-label">Username</label>
                                            <input type="text" class="form-control" id="username"
                                                placeholder="Enter your username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div class="form-group">
                                            <label for="phone" class="form-label">Phone Number</label>
                                            <input type="tel" class="form-control" id="phone" placeholder="XXX XXXXXX"
                                                name="phoneno"
                                                value={formData.phoneno}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div class="form-group">
                                            <label for="role" class="form-label">Facility District</label>
                                            <Select
                                                options={districtOptions}
                                                value={districtOptions.find(option => option.value === formData.district_id)}
                                                onChange={handleDistrictChange}
                                                placeholder="Select Facility District"
                                                classNamePrefix="select"
                                                className="select-container"
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="lastName" class="form-label">Last Name</label>
                                            <input type="text" class="form-control" id="lastName"
                                                placeholder="Enter last name"
                                                name="lastname"
                                                value={formData.lastname}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div class="form-group">
                                            <label for="password" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="password" 
                                                placeholder="Create password" 
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div class="form-group">
                                            <label for="email" class="form-label">Email Address</label>
                                            <input type="email" class="form-control" id="email"
                                                placeholder="Enter your email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div class="form-group">
                                            <label for="organization" class="form-label">Organization / Health Facility</label>
                                            <input type="text" class="form-control"
                                                id="organisation"
                                                name="organisation"
                                                value={formData.organisation}
                                                onChange={handleChange}
                                                placeholder="Organization / Health Facility, etc." required />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="terms" />
                                    <label class="form-check-label" for="terms" style={{ fontSize: '0.85rem' }}>
                                        I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                                    </label>
                                </div>

                                <button type="submit" class="btn btn-register" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <div class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <i class="fas fa-user-plus me-2"></i>
                                            Register Account
                                        </>
                                    )}
                                </button>
                            </form>

                            <div class="terms-text">
                                By creating an account, you agree to our terms and conditions and privacy policy.
                            </div>

                            <div class="login-link">
                                <p>Already have an account? <Link to="/login">Login</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Registration