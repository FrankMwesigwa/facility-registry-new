import React, { Fragment } from 'react'
import './styles.css'

const Manuals = () => {
    return (
        <Fragment>
            <div class="breadcrumb-section">
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="home.html">Home</a></li>
                            <li class="breadcrumb-item active">SOPs & Manuals</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="container">
                <div class="page-title-card">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h1 class="page-title">Standard Operating Procedures & Manuals</h1>
                            <p class="page-description">Access comprehensive documentation, guidelines, and procedures for the National Health Facility Registry system.</p>
                        </div>
                        {/* <div class="col-md-4 text-end">
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-upload"></i> Upload Document
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="content-section">
                    <div class="section-header">
                        <h5 class="section-title">
                            <i class="fas fa-file-alt"></i>
                            Standard Operating Procedures
                        </h5>
                    </div>
                    <div class="section-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="document-card">
                                    <div class="d-flex">
                                        <div class="file-icon pdf">
                                            <i class="fas fa-file-pdf"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="document-title">Facility Registration SOP</div>
                                            <div class="document-description">
                                                Complete procedure for registering new health facilities in the national registry system.
                                            </div>
                                            <div class="document-meta">
                                                <span><i class="fas fa-calendar"></i> Updated: Jan 15, 2024</span>
                                                <span><i class="fas fa-file"></i> 2.4 MB</span>
                                            </div>
                                            <div class="mb-2">
                                                <span class="category-badge">SOP</span>
                                                <span class="category-badge">Registration</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="btn btn-primary btn-document">
                                                    <i class="fas fa-download"></i> Download
                                                </button>
                                                <button class="btn btn-outline-primary btn-document">
                                                    <i class="fas fa-eye"></i> Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="document-card">
                                    <div class="d-flex">
                                        <div class="file-icon pdf">
                                            <i class="fas fa-file-pdf"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="document-title">Data Validation SOP</div>
                                            <div class="document-description">
                                                Standard procedures for validating and verifying health facility data entries.
                                            </div>
                                            <div class="document-meta">
                                                <span><i class="fas fa-calendar"></i> Updated: Dec 20, 2023</span>
                                                <span><i class="fas fa-file"></i> 1.8 MB</span>
                                            </div>
                                            <div class="mb-2">
                                                <span class="category-badge">SOP</span>
                                                <span class="category-badge">Data Quality</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="btn btn-primary btn-document">
                                                    <i class="fas fa-download"></i> Download
                                                </button>
                                                <button class="btn btn-outline-primary btn-document">
                                                    <i class="fas fa-eye"></i> Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content-section">
                    <div class="section-header">
                        <h5 class="section-title">
                            <i class="fas fa-book"></i>
                            User Manuals
                        </h5>
                    </div>
                    <div class="section-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="document-card">
                                    <div class="d-flex">
                                        <div class="file-icon doc">
                                            <i class="fas fa-file-word"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="document-title">System Administrator Manual</div>
                                            <div class="document-description">
                                                Comprehensive guide for system administrators managing the health facility registry.
                                            </div>
                                            <div class="document-meta">
                                                <span><i class="fas fa-calendar"></i> Updated: Feb 5, 2024</span>
                                                <span><i class="fas fa-file"></i> 5.2 MB</span>
                                            </div>
                                            <div class="mb-2">
                                                <span class="category-badge">Manual</span>
                                                <span class="category-badge">Admin</span>
                                            </div>
                                            <div class="document-actions">
                                                <button class="btn btn-primary btn-document">
                                                    <i class="fas fa-download"></i> Download
                                                </button>
                                                <button class="btn btn-outline-primary btn-document">
                                                    <i class="fas fa-eye"></i> Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="document-card">
                                    <div class="d-flex">
                                        <div class="file-icon doc">
                                            <i class="fas fa-file-word"></i>
                                        </div>
                                        <div class="flex-grow-1">
                                            <div class="document-title">End User Guide</div>
                                            <div class="document-description">
                                                Step-by-step guide for facility managers and data entry personnel.
                                            </div>
                                            <div class="document-meta">
                                                <span><i class="fas fa-calendar"></i> Updated: Jan 28, 2024</span>
                                        </div>
                                        <div class="mb-2">
                                            <span class="category-badge">Manual</span>
                                            <span class="category-badge">User Guide</span>
                                        </div>
                                        <div class="document-actions">
                                            <button class="btn btn-primary btn-document">
                                                <i class="fas fa-download"></i> Download
                                            </button>
                                            <button class="btn btn-outline-primary btn-document">
                                                <i class="fas fa-eye"></i> Preview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Fragment >
    )
}

export default Manuals