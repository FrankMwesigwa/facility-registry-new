import React, { Fragment } from 'react'
import './styles.css'

const AdditionRequest = () => {
    return (
        <Fragment>
            <div class="container mt-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 class="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>Add Facility Request</h2>
                        <p class="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Submit a new health facility registration request</p>
                    </div>
                    <div>
                        <a href="facility-requests.html" class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-arrow-left"></i> Back to Requests
                        </a>
                    </div>
                </div>

                <form>
                    <ul class="nav nav-tabs" id="facilityTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="basic-tab" data-bs-toggle="tab" data-bs-target="#basic" type="button" role="tab">
                                <i class="fas fa-info-circle me-1"></i>Basic Information
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="location-tab" data-bs-toggle="tab" data-bs-target="#location" type="button" role="tab">
                                <i class="fas fa-map-marker-alt me-1"></i>Location
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab">
                                <i class="fas fa-phone me-1"></i>Contact
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#services" type="button" role="tab">
                                <i class="fas fa-heartbeat me-1"></i>Services
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="documents-tab" data-bs-toggle="tab" data-bs-target="#documents" type="button" role="tab">
                                <i class="fas fa-file-alt me-1"></i>Documents
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="facilityTabContent">
                        <div class="tab-pane fade show active" id="basic" role="tabpanel">
                            <div class="form-card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        <i class="fas fa-info-circle"></i>
                                        Basic Information
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">Facility Name <span class="required">*</span></label>
                                                <input type="text" class="form-control" required />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">Facility Code</label>
                                                <input type="text" class="form-control" placeholder="Auto-generated if left empty" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Facility Level <span class="required">*</span></label>
                                               <select className="form-control" 
                                                        name="level">
                                                    <option value="">Select Level</option>
                                                    <option value="HC II">HC II</option>
                                                    <option value="HC III">HC III</option>
                                                    <option value="HC IV">HC IV</option>
                                                    <option value="HC IV">HC IV</option>
                                                    <option value="Clinic">Clinic</option>
                                                    <option value="General Hospital">General Hospital</option>
                                                    <option value="RRH">Regional Referral Hospital</option>
                                                    <option value="NRH">National Referral Hospital</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Ownership <span class="required">*</span></label>
                                                <select className="form-control" 
                                                        name="ownership">
                                                    <option value="">Select Ownership</option>
                                                    <option value="PFP">Private For Private</option>
                                                    <option value="PNFP">Private Not For Profit</option>
                                                    <option value="GOV">Government</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Operational Status <span class="required">*</span></label>
                                                 <select className="form-control" 
                                                        name="authority">
                                                    <option value="">Select Authority</option>
                                                    <option value="MOH">Ministry of Health</option>
                                                    <option value="Private Authority">Private Authority</option>
                                                    <option value="UPMB">UPMB</option>
                                                    <option value="UCMB">UCMB</option>
                                                    <option value="UMMB">UMMB</option>
                                                    <option value="NGO">NGO</option>
                                                    <option value="UPF">UPF</option>
                                                    <option value="SOS">SOS</option>
                                                    <option value="BOU">BOU</option>
                                                    <option value="UCBHCA">UCBHCA</option>
                                                    <option value="UNHCR">UNHCR</option>
                                                    <option value="MoES">MoES</option>
                                                    <option value="Local Government">Local Government</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="location" role="tabpanel">
                            <div class="form-card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Location Information
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Region <span class="required">*</span></label>
                                                <select class="form-select" required>
                                                    <option value="">Select Region</option>
                                                    <option>Central</option>
                                                    <option>Eastern</option>
                                                    <option>Northern</option>
                                                    <option>Western</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">District <span class="required">*</span></label>
                                                <select class="form-select" required>
                                                    <option value="">Select District</option>
                                                    <option>Kampala</option>
                                                    <option>Wakiso</option>
                                                    <option>Mukono</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Sub County</label>
                                                <select class="form-select">
                                                    <option value="">Select Sub County</option>
                                                    <option>Nakawa</option>
                                                    <option>Kawempe</option>
                                                    <option>Makindye</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Parish/Ward</label>
                                                <input type="text" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">Physical Address</label>
                                                <textarea class="form-control" rows="2"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Latitude</label>
                                                <input type="text" class="form-control" placeholder="0.000000" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="mb-3">
                                                <label class="form-label">Longitude</label>
                                                <input type="text" class="form-control" placeholder="0.000000" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="contact" role="tabpanel">
                            <div class="form-card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        <i class="fas fa-phone"></i>
                                        Contact Information
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Phone Number</label>
                                                <input type="tel" class="form-control" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Email Address</label>
                                                <input type="email" class="form-control" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label">Website</label>
                                                <input type="url" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">In-Charge Name</label>
                                                <input type="text" class="form-control" />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label">In-Charge Contact</label>
                                                <input type="tel" class="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="services" role="tabpanel">
                            <div class="form-card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        <i class="fas fa-heartbeat"></i>
                                        Services Offered
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="maternity" />
                                                <label class="form-check-label" for="maternity">Maternity</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="surgery" />
                                                <label class="form-check-label" for="surgery">Surgery</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="emergency" />
                                                <label class="form-check-label" for="emergency">Emergency</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="laboratory" />
                                                <label class="form-check-label" for="laboratory">Laboratory</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="pharmacy" />
                                                <label class="form-check-label" for="pharmacy">Pharmacy</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="radiology" />
                                                <label class="form-check-label" for="radiology">Radiology</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="dental" />
                                                <label class="form-check-label" for="dental">Dental</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="mental-health" />
                                                <label class="form-check-label" for="mental-health">Mental Health</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="nutrition" />
                                                <label class="form-check-label" for="nutrition">Nutrition</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="immunization" />
                                                <label class="form-check-label" for="immunization">Immunization</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="family-planning" />
                                                <label class="form-check-label" for="family-planning">Family Planning</label>
                                            </div>
                                            <div class="form-check mb-2">
                                                <input class="form-check-input" type="checkbox" id="hiv-aids" />
                                                <label class="form-check-label" for="hiv-aids">HIV/AIDS</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="documents" role="tabpanel">
                            <div class="form-card">
                                <div class="card-header">
                                    <h5 class="card-title">
                                        <i class="fas fa-file-alt"></i>
                                        Supporting Documents
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="file-upload-area">
                                        <i class="fas fa-cloud-upload-alt" style={{fontSize: '2rem', color: 'var(--text-muted)'}}></i>
                                        <p class="mt-2 mb-1">Drag and drop files here or click to browse</p>
                                        <small class="text-muted">Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</small>
                                        <input type="file" class="form-control mt-3" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                    </div>
                                    <small class="text-muted">
                                        Please upload: License documents, Building permits, Staff certificates, Equipment lists
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-navigation d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-secondary" id="prevBtn" onclick="previousTab()">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <div>
                            <button type="button" class="btn btn-outline-primary me-2">
                                <i class="fas fa-file"></i> Save as Draft
                            </button>
                            <button type="button" class="btn btn-primary" id="nextBtn" onclick="nextTab()">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                            <button type="submit" class="btn btn-success d-none" id="submitBtn">
                                <i class="fas fa-check-circle"></i> Submit Request
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default AdditionRequest