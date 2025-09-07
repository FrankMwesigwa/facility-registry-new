import React from 'react';

const StandardDetails = ({ request, getStatusBadge, formatDate }) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-info-circle"></i>
                                Basic Information
                            </h5>
                        </div>
                        <div className="section-body">
                            <div className="info-item">
                                <span className="info-label">Facility Name</span>
                                <span className="info-value">{request.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Request Type</span>
                                <span className="info-value">{request.request_type?.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Level</span>
                                <span className="info-value">{request.level}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ownership</span>
                                <span className="info-value">{request.ownership}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Authority</span>
                                <span className="info-value">{request.authority}</span>
                            </div>
                             <div className="info-item">
                                <span className="info-label">Licensed</span>
                                <span className="info-value">{request.licensed || 'N/A'}</span>
                            </div> 
                             <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="info-value">{getStatusBadge(request.status)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Date Submitted</span>
                                <span className="info-value">{formatDate(request.createdAt)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Bed Capacity</span>
                                <span className="info-value">{request.bed_capacity || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-map-marker-alt"></i>
                                Location Details
                            </h5>
                        </div>
                        <div className="section-body">
                            <div className="info-item">
                                <span className="info-label">Region</span>
                                <span className="info-value">{request.Region?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">District</span>
                                <span className="info-value">{request.District?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Sub County</span>
                                <span className="info-value">{request.SubCounty?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Physical Address</span>
                                <span className="info-value">{request.address || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">GPS Coordinates</span>
                                <span className="info-value">
                                    {request.latitude && request.longitude 
                                        ? `${request.latitude}° N, ${request.longitude}° E` 
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Date Opened</span>
                                <span className="info-value">{request.date_opened ? formatDate(request.date_opened) : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StandardDetails;


