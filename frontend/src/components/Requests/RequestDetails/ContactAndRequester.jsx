import React from 'react';

const ContactAndRequester = ({ request, formatDate }) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-phone"></i>
                                Contact Information
                            </h5>
                        </div>
                        <div className="section-body">
                            <div className="info-item">
                                <span className="info-label">Contact Person</span>
                                <span className="info-value">{request.contact_personname || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Title</span>
                                <span className="info-value">{request.contact_persontitle || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Mobile Phone</span>
                                <span className="info-value">{request.contact_personmobile || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{request.contact_personemail || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-user"></i>
                                Requested By
                            </h5>
                        </div>
                        <div className="section-body">
                            {request.RequestedBy ? (
                                <>
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">
                                            {`${request.RequestedBy.firstname || ''} ${request.RequestedBy.lastname || ''}`.trim() || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{request.RequestedBy.email || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone Number</span>
                                        <span className="info-value">{request.RequestedBy.phoneno || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Request Date</span>
                                        <span className="info-value">{formatDate(request.createdAt)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="info-item">
                                    <span className="info-value">User information not available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactAndRequester;


