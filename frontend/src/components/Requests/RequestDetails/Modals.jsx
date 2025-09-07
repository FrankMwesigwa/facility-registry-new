import React from 'react';

export const ApproveModal = ({ show, onClose, onConfirm, actionLoading, approveComments, setApproveComments, request }) => {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-white">
                            <i className="fas fa-check-circle me-2"></i>
                            Approve Facility Request
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={actionLoading}></button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-3">You are about to approve the facility request for <strong>{request?.name}</strong>.</p>
                        <div className="mb-3">
                            <label htmlFor="approveComments" className="form-label">Comments (Optional)</label>
                            <textarea id="approveComments" className="form-control" rows="3" placeholder="Enter any approval comments..." value={approveComments} onChange={(e) => setApproveComments(e.target.value)} disabled={actionLoading}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={actionLoading}>Cancel</button>
                        <button type="button" className="btn btn-success" onClick={onConfirm} disabled={actionLoading}>
                            {actionLoading ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Approving...</>) : (<><i className="fas fa-check me-2"></i>Approve Request</>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RejectModal = ({ show, onClose, onConfirm, actionLoading, rejectComments, setRejectComments, request }) => {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-white">
                            <i className="fas fa-times-circle me-2"></i>
                            Reject Facility Request
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={actionLoading}></button>
                    </div>
                    <div className="modal-body">
                        <p className="mb-3">You are about to reject the facility request for <strong>{request?.name}</strong>.</p>
                        <div className="mb-3">
                            <label htmlFor="rejectComments" className="form-label">Rejection Reason <span className="text-danger">*</span></label>
                            <textarea id="rejectComments" className="form-control" rows="3" placeholder="Please provide a reason for rejecting this request..." value={rejectComments} onChange={(e) => setRejectComments(e.target.value)} disabled={actionLoading} required></textarea>
                            <div className="form-text">This reason will be visible to the requester and other stakeholders.</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={actionLoading}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={actionLoading}>
                            {actionLoading ? (<><span className="spinner-border spinner-border-sm me-2" role="status"></span>Rejecting...</>) : (<><i className="fas fa-times me-2"></i>Reject Request</>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FeedbackModal = ({ feedback, onClose }) => {
    if (!feedback?.show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header ${feedback.isError ? 'bg-danger' : 'bg-success'}`}>
                        <h5 className="modal-title text-white">
                            {feedback.isError ? <i className="fas fa-exclamation-triangle me-2"></i> : <i className="fas fa-check-circle me-2"></i>}
                            {feedback.title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>{feedback.message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


