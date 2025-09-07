import React, { useEffect, useState, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from "../../../helpers/api";
import './styles.css'
import HeaderSection from './HeaderSection';
import UpdateSplitView from './UpdateSplitView';
import StandardDetails from './StandardDetails';
import ContactAndRequester from './ContactAndRequester';
import DocumentsSection from './DocumentsSection';
import ServicesSection from './ServicesSection';
import { ApproveModal, RejectModal, FeedbackModal } from './Modals';

const RequestDetails = () => {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [approveComments, setApproveComments] = useState('');
    const [rejectComments, setRejectComments] = useState('');
    const [feedback, setFeedback] = useState({ show: false, title: '', message: '', isError: false });
    const [currentFacility, setCurrentFacility] = useState(null);
    const [currentFacilityLoading, setCurrentFacilityLoading] = useState(false);

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    setUser(JSON.parse(userStr));
                }

                const response = await API.get(`/facilityrequests/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Request Data:', response.data);
                setRequest(response.data);

                // If this is a Facility Update request, fetch current facility from MFL
                if (response.data?.request_type === 'Facility_Update' && response.data?.facility_id) {
                    setCurrentFacilityLoading(true);
                    try {
                        const mflRes = await API.get(`/mfl/${response.data.facility_id}`);
                        setCurrentFacility(mflRes.data);
                    } catch (mflErr) {
                        console.error('Error fetching current facility from MFL:', mflErr);
                    } finally {
                        setCurrentFacilityLoading(false);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching request:', err);
                setError('Failed to fetch request details');
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

    const handleApprove = () => {
        setShowApproveModal(true);
    };

    const confirmApprove = async () => {
        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            await API.post(`/facilityrequests/${id}/approve`,
                { comments: approveComments },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            closeApproveModal();
            // Refresh the request data
            window.location.reload();
        } catch (err) {
            console.error('Error approving request:', err);
            setFeedback({ show: true, title: 'Approval Failed', message: (err.response?.data?.message || err.message), isError: true });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = () => {
        setShowRejectModal(true);
    };

    const closeApproveModal = () => {
        setShowApproveModal(false);
        setApproveComments('');
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setRejectComments('');
    };

    const confirmReject = async () => {
        if (!rejectComments.trim()) {
            setFeedback({ show: true, title: 'Validation Error', message: 'Rejection reason is required', isError: true });
            return;
        }

        try {
            setActionLoading(true);
            const token = localStorage.getItem('token');

            await API.post(`/facilityrequests/${id}/reject`,
                { comments: rejectComments },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            closeRejectModal();
            // Refresh the request data
            window.location.reload();
        } catch (err) {
            console.error('Error rejecting request:', err);
            setFeedback({ show: true, title: 'Rejection Failed', message: (err.response?.data?.message || err.message), isError: true });
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'initiated': 'bg-warning',
            'district_approved': 'bg-primary',
            'planning_approved': 'bg-info',
            'approved': 'bg-success',
            'rejected': 'bg-danger'
        }
        const statusText = {
            'initiated': 'Pending',
            'district_approved': 'District Approved',
            'planning_approved': 'Planning Approved',
            'approved': 'Approved',
            'rejected': 'Rejected'
        }
        return (
            <span className={`badge ${statusClasses[status] || 'bg-secondary'} status-badge`}>
                {statusText[status] || status}
            </span>
        )
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    const openDocument = (documentPath) => {
        if (!documentPath) return;
        // Construct the full URL to the document - static files are served at root level, not under /api
        const baseUrl = process.env.NODE_ENV === "development"
            ? (process.env.REACT_APP_API_BASE_URL_DEV?.replace('/api', ''))
            : (process.env.REACT_APP_API_BASE_URL_PROD?.replace('/api', ''));
        const documentUrl = `${baseUrl}/${documentPath}`;

        console.log('Opening document:', documentUrl);

        // Try to open the document and handle potential errors
        try {
            window.open(documentUrl, '_blank');
        } catch (error) {
            console.error('Error opening document:', error);
            alert('Unable to open document. Please try again.');
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error!</h4>
                <p>{error}</p>
            </div>
        </div>
    );

    if (!request) return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Not Found!</h4>
                <p>No facility request found with the given ID.</p>
            </div>
        </div>
    );

    return (
        <Fragment>
            <div className="breadcrumb-section">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/facility-requests">Facility Requests</Link></li>
                            <li className="breadcrumb-item active">{request.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <HeaderSection
                request={request}
                user={user}
                actionLoading={actionLoading}
                onApprove={handleApprove}
                onReject={handleReject}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
            />

            {request.request_type === 'Facility_Update' ? (
                <>
                    <UpdateSplitView
                        currentFacility={currentFacility}
                        currentFacilityLoading={currentFacilityLoading}
                        request={request}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                    />
                    <DocumentsSection request={request} openDocument={openDocument} />
                    <ServicesSection services={request.services} />
                </>

            ) : (
                <>
                    <StandardDetails
                        request={request}
                        getStatusBadge={getStatusBadge}
                        formatDate={formatDate}
                    />
                    <ContactAndRequester request={request} formatDate={formatDate} />
                    <DocumentsSection request={request} openDocument={openDocument} />
                    <ServicesSection services={request.services} />
                </>

            )}



            <ApproveModal
                show={showApproveModal}
                onClose={closeApproveModal}
                onConfirm={confirmApprove}
                actionLoading={actionLoading}
                approveComments={approveComments}
                setApproveComments={setApproveComments}
                request={request}
            />
            <RejectModal
                show={showRejectModal}
                onClose={closeRejectModal}
                onConfirm={confirmReject}
                actionLoading={actionLoading}
                rejectComments={rejectComments}
                setRejectComments={setRejectComments}
                request={request}
            />
            <FeedbackModal
                feedback={feedback}
                onClose={() => setFeedback({ show: false, title: '', message: '', isError: false })}
            />
        </Fragment>
    )
}

export default RequestDetails