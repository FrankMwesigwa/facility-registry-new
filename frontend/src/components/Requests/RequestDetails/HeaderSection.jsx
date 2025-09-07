import React from 'react';

const HeaderSection = ({ request, user, actionLoading, onApprove, onReject, getStatusBadge, formatDate }) => {
    return (
        <div className="container">
            <div className="facility-name-card">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h1 className="facility-title">{request.name}</h1>
                        <div className="facility-code">Request ID: REQ-{new Date().getFullYear()}-{String(request.id).padStart(3, '0')}</div>
                        <div className="facility-badges">
                            <span className="badge bg-primary">{request.level}</span>
                            {getStatusBadge(request.status)}
                            <span className="badge bg-info">{request.ownership}</span>
                            <span className="info-value">{request.request_type?.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                                <span className="info-label">Request Type</span>
                                <span className="info-value">{request.request_type?.replace('_', ' ').toUpperCase()}</span>
                            </div>
                        {request.status === 'rejected' && request.rejectionInfo && (
                            <div className="rejection-info mt-3">
                                <div className="alert alert-danger" role="alert">
                                    <h6 className="alert-heading mb-2">
                                        <i className="fas fa-times-circle"></i> Request Rejected
                                    </h6>
                                    <div className="rejection-details">
                                        <p className="mb-1">
                                            <strong>Rejected by:</strong> {`${request.rejectionInfo.rejectedBy?.firstname || ''} ${request.rejectionInfo.rejectedBy?.lastname || ''}`.trim() || 'N/A'}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Date:</strong> {formatDate(request.rejectionInfo.rejectedAt)}
                                        </p>
                                        {request.rejectionInfo.comments && (
                                            <p className="mb-0">
                                                <strong>Reason:</strong> {request.rejectionInfo.comments}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-4 text-end">
                        {user && user.role !== 'public'&& (
                            <div className="action-buttons">
                                <button 
                                    className="btn btn-success btn-action me-2"
                                    onClick={onApprove}
                                    disabled={actionLoading}
                                >
                                    <i className="fas fa-check"></i>
                                    {actionLoading ? 'Processing...' : 'Approve'}
                                </button>
                                <button 
                                    className="btn btn-danger btn-action"
                                    onClick={onReject}
                                    disabled={actionLoading}
                                >
                                    <i className="fas fa-times"></i>
                                    {actionLoading ? 'Processing...' : 'Reject'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderSection;


