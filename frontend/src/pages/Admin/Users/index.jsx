import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../../helpers/api'
import './styles.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [role, setRole] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let isMounted = true
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const params = { page, limit }
        if (role) params.role = role
        const { data } = await API.get('/users', { params })
        if (isMounted) {
          setUsers(data.users || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchUsers()
    return () => { isMounted = false }
  }, [page, limit, role])


  const getRoleBadge = (role) => {
    const roleClasses = {
      'admin': 'bg-danger',
      'district': 'bg-primary',
      'planning': 'bg-info',
      'public': 'bg-secondary'
    }
    return (
      <span className={`badge ${roleClasses[role] || 'bg-secondary'} status-badge`}>
        {role?.charAt(0).toUpperCase() + role?.slice(1) || 'Unknown'}
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.organisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.district?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = role === '' || user.role === role
    
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="container users-container">
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
      <div className="container users-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
  <div className="container users-container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>Users Management</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Manage system users and their access permissions</p>
        </div>
        <div>
          <Link className="btn btn-primary btn-sm" to="/admin/users/new">
            <i className="fas fa-plus-circle"></i> Add User
          </Link>
        </div>
      </div>

      <div className="search-section">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-search"></i></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              className="form-select"
              value={role}
              onChange={(e) => { setPage(1); setRole(e.target.value) }}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="district">District</option>
              <option value="planning">Planning</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary btn-sm w-100" onClick={() => { setRole(''); setSearchTerm(''); setPage(1); }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table facilities-table table-hover mb-0">
              <thead>
                <tr>
                  <th>USER ID</th>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>USERNAME</th>
                  <th>ORGANISATION</th>
                  <th>PHONE NO</th>
                  <th>DISTRICT</th>
                  <th>ROLE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="card border-0 bg-light mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="card-body">
                          <i className="fas fa-users fa-3x text-muted mb-3"></i>
                          <h5 className="card-title text-muted">No Users Found</h5>
                          <p className="card-text text-muted">
                            {searchTerm || role 
                              ? 'No users match your current filters. Try adjusting your search criteria.'
                              : 'No users are currently registered in the system.'
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id || index}>
                      <td>
                        <div className="facility-code">USR-{new Date().getFullYear()}-{String(user.id || index + 1).padStart(3, '0')}</div>
                      </td>
                      <td>
                        <div className="facility-name">{[user.firstname, user.lastname].filter(Boolean).join(' ') || 'N/A'}</div>
                      </td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.username || '-'}</td>
                      <td>{user.organisation || '-'}</td>
                      <td>{user.phone || '-'}</td>
                      <td>{user.district || '-'}</td>
                      <td>{getRoleBadge(user.role)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <nav aria-label="Users pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                disabled={page <= 1 || loading} 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
            </li>
            <li className="page-item active">
              <button className="page-link">{page}</button>
            </li>
            <li className={`page-item ${page >= Math.ceil(total / limit) ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                disabled={page >= Math.ceil(total / limit) || loading} 
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {filteredUsers.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total users</div>
          <div className="text-muted">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
  )
}

export default Users