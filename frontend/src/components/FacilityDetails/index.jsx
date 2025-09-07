import React, { useEffect, useState, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from "../../helpers/api";
import './styles.css'

const FacilityDetails = ({url}) => {
    const { id } = useParams();
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFacilityDetails = async () => {
            try {
                const response = await API.get(`/mfl/${id}`);
                console.log('Facility Data:', response.data);
                setFacility(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching facility:', err);
                setError('Failed to fetch facility details');
                setLoading(false);
            }
        };

        fetchFacilityDetails();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!facility) return <div>No facility found</div>;

    return (
        <Fragment>
            <div class="breadcrumb-section">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li class="breadcrumb-item"><Link to="/facilities">Health Facilities</Link></li>
                            <li class="breadcrumb-item active">{facility.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="container">
                <div class="facility-name-card">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h1 class="facility-title">{facility.name}</h1>
                            <div class="facility-code">Full Facility Code: {facility.unique_identifier}</div>
                            <div class="facility-badges">
                                <span class="badge bg-primary">{facility.level}</span>
                                <span class="badge bg-success">Functional</span>
                                <span class="badge bg-info">{facility.ownership}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <div class="content-section">
                            <div class="section-header">
                                <h5 class="section-title">
                                    <i class="fas fa-info-circle"></i>
                                    Basic Information
                                </h5>
                            </div>
                            <div class="section-body">
                                <div class="info-item">
                                    <span class="info-label">Facility Name</span>
                                    <span class="info-value">{facility.name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Facility Code</span>
                                    <span class="info-value">{facility.unique_identifier}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Level</span>
                                    <span class="info-value">{facility.level}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Ownership</span>
                                    <span class="info-value">{facility.ownership}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Status</span>
                                    <span class="info-value">
                                        <span class="badge bg-success">Functional</span>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Date Established</span>
                                    <span class="info-value">January 15, 2020</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="content-section">
                            <div class="section-header">
                                <h5 class="section-title">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location Details
                                </h5>
                            </div>
                            <div class="section-body">
                                <div class="info-item">
                                    <span class="info-label">District</span>
                                    <span class="info-value">{facility.District?.name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Sub County</span>
                                    <span class="info-value">{facility.SubCounty?.name}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Parish</span>
                                    <span class="info-value">Nakawa Central</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Village</span>
                                    <span class="info-value">Nakawa Trading Center</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Physical Address</span>
                                    <span class="info-value">Plot 45, Nakawa Road</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">GPS Coordinates</span>
                                    <span class="info-value">0.3476° N, 32.6204° E</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="content-section">
                            <div class="section-header">
                                <h5 class="section-title">
                                    <i class="fas fa-phone"></i>
                                    Contact Information
                                </h5>
                            </div>
                            <div class="section-body">
                                <div class="info-item">
                                    <span class="info-label">Primary Phone</span>
                                    <span class="info-value">+256 414 123456</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Alternative Phone</span>
                                    <span class="info-value">+256 772 123456</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Email</span>
                                    <span class="info-value">frank.hc4@health.go.ug</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">In-Charge</span>
                                    <span class="info-value">Dr. Sarah Nakamya</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">In-Charge Phone</span>
                                    <span class="info-value">+256 701 234567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="content-section">
                            <div class="section-header">
                                <h5 class="section-title">
                                    <i class="fas fa-clock"></i>
                                    Operating Hours
                                </h5>
                            </div>
                            <div class="section-body">
                                <div class="info-item">
                                    <span class="info-label">Monday - Friday</span>
                                    <span class="info-value">8:00 AM - 5:00 PM</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Saturday</span>
                                    <span class="info-value">8:00 AM - 1:00 PM</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Sunday</span>
                                    <span class="info-value">Emergency Only</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Emergency Services</span>
                                    <span class="info-value">24/7 Available</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Maternity Ward</span>
                                    <span class="info-value">24/7 Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content-section">
                    <div class="section-header">
                        <h5 class="section-title">
                            <i class="fas fa-heartbeat"></i>
                            Services Offered
                        </h5>
                    </div>
                    <div class="section-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6 class="mb-3">Primary Services</h6>
                                <span class="service-tag">General Outpatient</span>
                                <span class="service-tag">Maternity Services</span>
                                <span class="service-tag">Laboratory Services</span>
                                <span class="service-tag">Pharmacy</span>
                                <span class="service-tag">Immunization</span>
                                <span class="service-tag">Family Planning</span>
                                <span class="service-tag">Antenatal Care</span>
                                <span class="service-tag">Child Health</span>
                            </div>
                            <div class="col-md-6">
                                <h6 class="mb-3">Specialized Services</h6>
                                <span class="service-tag">Minor Surgery</span>
                                <span class="service-tag">Emergency Care</span>
                                <span class="service-tag">Dental Services</span>
                                <span class="service-tag">Eye Care</span>
                                <span class="service-tag">HIV/AIDS Care</span>
                                <span class="service-tag">TB Treatment</span>
                                <span class="service-tag">Mental Health</span>
                                <span class="service-tag">Nutrition Services</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default FacilityDetails