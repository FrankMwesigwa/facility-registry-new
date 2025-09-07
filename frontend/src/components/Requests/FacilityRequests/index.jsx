import React, { Fragment, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'
import './styles.css'

const FacilityRequests = ({url, title, detail, show}) => {
    const history = useHistory()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            setUser(JSON.parse(userStr))
        }
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            setError(null)
            const token = localStorage.getItem('token')
            
            const response = await API.get(`/facilityrequests/${url}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            const requestData = response.data?.request || response.data
            setRequests(Array.isArray(requestData) ? requestData : [])
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch facility requests')
            setRequests([])
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = (requestId) => {
        history.push(`/${detail}/${requestId}`)
    }

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
    }

    const getTypeBadge = (type) => {
        const typeClasses = {
            'new_registration': 'bg-info',
            'update_request': 'bg-secondary',
            'closure_request': 'bg-dark'
        }
        const typeText = {
            'new_registration': 'New Registration',
            'update_request': 'Update Request',
            'closure_request': 'Closure Request'
        }
        return (
            <span className={`badge ${typeClasses[type] || 'bg-info'} status-badge`}>
                {typeText[type] || type}
            </span>
        )
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getRequestedByName = (request) => {
        const requestedBy = request?.RequestedBy
        if (requestedBy) {
            const first = requestedBy.firstname || ''
            const last = requestedBy.lastname || ''
            const full = `${first} ${last}`.trim()
            return full || requestedBy.email || 'N/A'
        }
        if (request.requested_by_name) return request.requested_by_name
        if (request.requested_by_fullname) return request.requested_by_fullname
        return request.requested_by || 'N/A'
    }

    const filteredRequests = (Array.isArray(requests) ? requests : []).filter(request => {
        const matchesSearch = request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            request.contact_personname?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter
        const matchesType = typeFilter === 'all' || request.request_type === typeFilter
        
        return matchesSearch && matchesStatus && matchesType
    })

    if (loading) {
        return (
            <div className="container facility-requests-container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container facility-requests-container">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={fetchRequests}>
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // If no requests exist, show only the no requests message
    if (requests.length === 0) {
        return (
            <div className="container facility-requests-container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>{title}</h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Manage facility registration and update requests</p>
                    </div>
                </div>
                
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px', padding: '2rem 0' }}>
                    <div className="card" style={{ 
                        maxWidth: '450px', 
                        width: '100%',
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                    }}>
                        <div className="card-body text-center" style={{ padding: '3rem 2rem' }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                backgroundColor: '#e9ecef', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}>
                                <i className="fas fa-clipboard-list" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
                            </div>
                            <h4 className="card-title mb-3" style={{ 
                                color: '#495057', 
                                fontWeight: '600',
                                fontSize: '1.5rem',
                                letterSpacing: '-0.02em'
                            }}>
                                No Facility Requests
                            </h4>
                            <p className="card-text" style={{ 
                                color: '#6c757d', 
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                marginBottom: '0'
                            }}>
                                Currently no facility requests are available for your district. 
                                New requests will appear here when submitted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Fragment>
            <div className="container facility-requests-container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>{title}</h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Manage facility registration and update requests</p>
                    </div>
                    {/* <div>
                        <a href="add-facility-request.html" className="btn btn-primary btn-sm">
                            <i className="fas fa-plus-circle"></i> Add New Request
                        </a>
                    </div> */}
                </div>

                <div className="search-section">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-search"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search requests..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="initiated">Pending</option>
                                <option value="district_approved">District Approved</option>
                                <option value="planning_approved">Planning Approved</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="new_registration">New Registration</option>
                                <option value="update_request">Update Request</option>
                                <option value="closure_request">Closure Request</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-outline-primary btn-sm w-100">Apply Filters</button>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    {/* <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title">
                            <i className="fas fa-clipboard-check"></i>
                            Facility Requests ({filteredRequests.length} total)
                        </h5>
                        <div>
                            <button className="btn btn-success export-btn">
                                <i className="fas fa-file-excel"></i> EXCEL
                            </button>
                            <button className="btn btn-danger export-btn">
                                <i className="fas fa-file-pdf"></i> PDF
                            </button>
                        </div>
                    </div> */}
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table facilities-table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>REQUEST ID</th>
                                        <th>FACILITY NAME</th>
                                        <th>TYPE</th>
                                        <th>SUBMITTED BY</th>
                                        <th>DATE & TIME</th>
                                        <th>STATUS</th>
                                        {show && <th>ACTIONS</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan={user && user.role !== 'public' ? "7" : "6"} className="text-center py-5">
                                                <div className="card border-0 bg-light mx-auto" style={{ maxWidth: '400px' }}>
                                                    <div className="card-body">
                                                        <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                                                        <h5 className="card-title text-muted">No Facility Requests</h5>
                                                        <p className="card-text text-muted">
                                                            Currently no facility requests are available for your district.
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRequests.map((request, index) => (
                                            <tr key={request.id}>
                                                <td>
                                                    <div className="facility-code">REQ-{new Date().getFullYear()}-{String(request.id).padStart(3, '0')}</div>
                                                </td>
                                                <td>
                                                    <div className="facility-name">{request.name || 'N/A'}</div>
                                                </td>
                                                <td>{getTypeBadge(request.request_type)}</td>
                                                <td>{getRequestedByName(request)}</td>
                                                <td>
                                                    {formatDate(request.createdAt)} <small className="text-muted">{formatTime(request.createdAt)}</small>
                                                </td>
                                                <td>{getStatusBadge(request.status)}</td>
                                                {show && (
                                                    <td>
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleViewDetails(request.id)}
                                                            title="View Request Details"
                                                        >
                                                            <i className="fas fa-eye"></i> View Details
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {filteredRequests.length > 0 && (
                    <nav aria-label="Requests pagination">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled">
                                <button className="page-link" disabled>Previous</button>
                            </li>
                            <li className="page-item active">
                                <button className="page-link">1</button>
                            </li>
                            <li className="page-item">
                                <button className="page-link">2</button>
                            </li>
                            <li className="page-item">
                                <button className="page-link">Next</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </Fragment>
    )
}

export default FacilityRequests