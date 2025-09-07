import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'
import { toast } from 'react-toastify'
import './styles.css'

const StatusTrackling = ({ requestId }) => {
  const historyNav = useHistory()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const path = requestId 
          ? `/facilityrequests/${requestId}/status`
          : '/facilityrequests/my/status'
        const res = await API.get(path, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setHistory(res.data.data || [])
      } catch (err) {
        console.error('Failed to load status history', err)
        toast.error('Failed to load status history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [requestId])

  const filtered = useMemo(() => {
    if (filter === 'all') return history
    return history.filter(h => (h.status || '').toLowerCase() === filter)
  }, [history, filter])

  const groupedByRequest = useMemo(() => {
    const groups = new Map()
    filtered.forEach(item => {
      const reqId = item.request?.id || (requestId || 'others')
      const key = String(reqId)
      const current = groups.get(key) || {
        request: item.request || (requestId ? { id: requestId, name: item.request?.name || `Request #${requestId}` } : null),
        items: []
      }
      current.items.push(item)
      groups.set(key, current)
    })
    // sort items inside each group by createdAt ascending for timeline
    groups.forEach(group => {
      group.items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    })
    return Array.from(groups.values())
  }, [filtered, requestId])

  return (
    <Fragment>
      <div className="container status-trackling-page">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>
              Request Status Tracking
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              View the progression and decisions on your submitted requests
            </p>
          </div>
          <div>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => historyNav.goBack()}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <div className="form-card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="fas fa-stream"></i>
              Status Timeline
            </h5>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-control form-control-sm"
                style={{ width: 220 }}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="initiated">Initiated</option>
                <option value="district_approved">District Approved</option>
                <option value="moh_verified">MoH Verified</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="request initiated">Request Initiated</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-muted">Loading…</div>
            ) : groupedByRequest.length === 0 ? (
              <div className="alert alert-light mb-0">No status history yet.</div>
            ) : (
              <div className="request-groups">
                {groupedByRequest.map(group => (
                  <div key={group.request?.id || 'others'} className="request-group">
                    <div className="request-group-header">
                      <div className="title">
                        <i className="fas fa-hospital"></i>
                        {group.request?.name || 'Request'}
                      </div>
                      {group.request?.id && (
                        <div className="chip">ID: {group.request.id}</div>
                      )}
                    </div>
                    <ul className="timeline">
                      {group.items.map(item => (
                        <li key={item.id} className="timeline-item">
                          <div className={`badge status-${(item.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status}
                          </div>
                          <div className="content">
                            <div className="meta">
                              <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
                              {item.owner?.name && <span className="by"> • by {item.owner.name}</span>}
                              {item.approvedBy?.name && <span className="by"> • approved by {item.approvedBy.name}</span>}
                              {item.rejectedBy?.name && <span className="by"> • rejected by {item.rejectedBy.name}</span>}
                            </div>
                            {item.comments && <div className="comments">{item.comments}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default StatusTrackling