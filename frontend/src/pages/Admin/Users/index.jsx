import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../../helpers/api'
import './styles.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [role, setRole] = useState('')

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

  return (
    <div className="container users-page mt-5">
      <div className="users-page__header d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Users</h2>
        <Link className="btn btn-primary btn-sm" to="/admin/users/new">Add User</Link>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label">Filter by role</label>
              <select className="form-select" value={role} onChange={(e) => { setPage(1); setRole(e.target.value) }}>
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="district">District</option>
                <option value="planning">Planning</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label">Per page</label>
              <select className="form-select" value={limit} onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label d-block">&nbsp;</label>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => { setRole(''); setPage(1); }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="info">Loading users…</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6">No users found.</td>
                </tr>
              )}
              {users.map((u, idx) => (
                <tr key={u.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{[u.firstname, u.lastname].filter(Boolean).join(' ')}</td>
                  <td>{u.email}</td>
                  <td>{u.username || '-'}</td>
                  <td>{u.role}</td>
                  <td>{u.is_verified ? 'Verified' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total} total</div>
        <div>
          <button className="btn btn-outline-secondary btn-sm me-2" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
          <button className="btn btn-outline-secondary btn-sm" disabled={page >= Math.ceil(total / limit) || loading} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default Users