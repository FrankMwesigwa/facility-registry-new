import React, { Fragment } from 'react'
import './styles.css'

const FacilityDetails = () => {
    return (
        <Fragment>
            <div class="container">
                <nav aria-label="breadcrumb" class="mb-3">
                    <ol class="breadcrumb" style={{ fontSize: '0.8rem' }}>
                        <li class="breadcrumb-item"><a href="admin-dashboard.html">Dashboard</a></li>
                        <li class="breadcrumb-item"><a href="admin-master-facilities.html">Master Facilities</a></li>
                        <li class="breadcrumb-item active">Frank Health Center IV</li>
                    </ol>
                </nav>

                <div class="facility-name-card">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 class="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.4rem' }}>Frank Health Center IV</h2>
                            <p class="text-muted mb-2" style={{ fontSize: '0.8rem' }}>UG-HC4-2024-001 • Registered: March 15, 2024</p>
                            <div class="d-flex gap-2">
                                <span class="level-badge">HC IV</span>
                                <span class="status-badge bg-success text-white">Functional</span>
                                <span class="status-badge bg-primary text-white">Government</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                </div>

                <div class="action-buttons">
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-success btn-sm">
                            <i class="fas fa-check-circle"></i> Approve Changes
                        </button>
                        <button class="btn btn-warning btn-sm">
                            <i class="fas fa-pause-circle"></i> Suspend
                        </button>
                        <button class="btn btn-info btn-sm">
                            <i class="fas fa-redo"></i> Update Status
                        </button>
                        <button class="btn btn-secondary btn-sm">
                            <i class="fas fa-history"></i> View History
                        </button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="info-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="fas fa-info-circle"></i>
                                    Basic Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="info-item">
                                    <span class="info-label">Facility Name:</span>
                                    <span class="info-value">Frank Health Center IV</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Facility Code:</span>
                                    <span class="info-value">UG-HC4-2024-001</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Level:</span>
                                    <span class="info-value"><span class="level-badge">HC IV</span></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Ownership:</span>
                                    <span class="info-value">Government</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Status:</span>
                                    <span class="info-value"><span class="status-badge bg-success text-white">Functional</span></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Registration Date:</span>
                                    <span class="info-value">March 15, 2024</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="info-item">
                                    <span class="info-label">Region:</span>
                                    <span class="info-value">Central</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">District:</span>
                                    <span class="info-value">Kampala</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Sub County:</span>
                                    <span class="info-value">Nakawa</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Parish:</span>
                                    <span class="info-value">Nakawa Parish</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Village:</span>
                                    <span class="info-value">Nakawa Village</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">GPS Coordinates:</span>
                                    <span class="info-value">0.3476° N, 32.6204° E</span>
                                </div>
                            </div>
                        </div>

                        <div class="info-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="fas fa-heartbeat"></i>
                                    Services Offered
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-2">
                                    <span class="service-tag">Maternity</span>
                                    <span class="service-tag">Laboratory</span>
                                    <span class="service-tag">Pharmacy</span>
                                    <span class="service-tag">Outpatient</span>
                                    <span class="service-tag">Inpatient</span>
                                    <span class="service-tag">Emergency</span>
                                    <span class="service-tag">Immunization</span>
                                    <span class="service-tag">Family Planning</span>
                                    <span class="service-tag">HIV/AIDS</span>
                                    <span class="service-tag">TB Treatment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="info-card">
                            <div class="card-header">
                                <h5 class="card-title">
                                    <i class="fas fa-phone"></i>
                                    Contact Information
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="info-item">
                                    <span class="info-label">Phone Number:</span>
                                    <span class="info-value">+256 414 123456</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Email Address:</span>
                                    <span class="info-value">frank.hc4@health.go.ug</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Postal Address:</span>
                                    <span class="info-value">P.O. Box 12345, Kampala</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Website:</span>
                                    <span class="info-value">www.frankhc4.go.ug</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">In-Charge:</span>
                                    <span class="info-value">Dr. Sarah Nakamya</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">In-Charge Phone:</span>
                                    <span class="info-value">+256 772 123456</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FacilityDetails