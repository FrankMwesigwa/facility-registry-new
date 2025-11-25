import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'
import './styles.css'

const Systems = () => {
  const history = useHistory()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await API.get('/systems')
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const onDelete = async (id) => {
    if (!window.confirm('Delete this system?')) return
    setError('')
    try {
      await API.delete(`/systems/${id}`)
      await fetchItems()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
  <div className="container users-container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.5rem' }}>Systems</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Registered systems that receive webhook updates</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => history.push('/admin/systems/new')}>
            <i className="fas fa-plus-circle" /> Add System
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={fetchItems} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      <div className="content-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table facilities-table table-hover mb-0">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>URL</th>
                  <th>API KEY</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="card border-0 bg-light mx-auto" style={{ maxWidth: '400px' }}>
                        <div className="card-body">
                          <i className="fas fa-diagram-project fa-3x text-muted mb-3"></i>
                          <h5 className="card-title text-muted">No Systems Found</h5>
                          <p className="card-text text-muted">
                            {loading ? 'Loading systems...' : 'No systems are currently registered.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {items.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="facility-name">{row.name}</div>
                    </td>
                    <td className="text-truncate" style={{maxWidth: 420}} title={row.url}>{row.url}</td>
                    <td className="text-monospace">{row.api_key}</td>
                    <td>
                      <span className={`badge ${row.is_active ? 'bg-success' : 'bg-secondary'} status-badge`}>
                        {row.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-outline-danger btn-sm action-btn" onClick={() => onDelete(row.id)}>
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Systems