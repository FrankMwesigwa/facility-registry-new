import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'
import './styles.css'

const emptyForm = { level: '', no_of_beds: 0, health_care_services: '' }

const LEVEL_OPTIONS = [
  'VHT',
  'HC II',
  'HC III',
  'HC IV',
  'General Hospital',
  'Regional Referral',
  'Specialist and National Referral Hospital',
]

const Services = () => {
  const history = useHistory()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await API.get('/services')
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

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: name === 'no_of_beds' ? Number(value || 0) : value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const parsedServicesArray = useMemo(() => {
    const text = form.health_care_services
    if (!text) return []
    // allow comma-separated or newline-separated
    return text
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
  }, [form.health_care_services])

  const startEdit = (row) => {
    setEditingId(row.id)
    setForm({
      level: row.level || '',
      no_of_beds: Number(row.no_of_beds || 0),
      health_care_services: Array.isArray(row.health_care_services) ? row.health_care_services.join(', ') : '',
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        level: form.level,
        no_of_beds: Number(form.no_of_beds || 0),
        health_care_services: parsedServicesArray,
      }

      if (editingId) {
        await API.put(`/services/${editingId}`, payload)
      } else {
        await API.post('/services', payload)
      }
      await fetchItems()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this service configuration?')) return
    setError('')
    try {
      await API.delete(`/services/${id}`)
      await fetchItems()
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

    return (
    <div className="container mt-4 services-spaced">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.5rem' }}>Services</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Configure health services by facility level</p>
        </div>
        <div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => history.push('/admin/dashboard')}>
            <i className="fas fa-arrow-left" /> Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      <div className="row">
        <div className="col-12 col-lg-5 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">{editingId ? 'Edit Configuration' : 'Add Configuration'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Level</label>
                  <select className="form-control" name="level" value={form.level} onChange={onChange} required>
                    <option value="">Select level</option>
                    {LEVEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Number of beds</label>
                  <input type="number" min="0" className="form-control" name="no_of_beds" value={form.no_of_beds} onChange={onChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Health care services</label>
                  <textarea className="form-control" rows="4" placeholder="Enter services separated by commas or new lines" name="health_care_services" value={form.health_care_services} onChange={onChange} required />
                  <small className="text-muted">Parsed: {parsedServicesArray.join(', ') || 'None'}</small>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={submitting}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7 mb-3">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Configured Services</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchItems} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th className="text-end">Beds</th>
                      <th>Services</th>
                      <th style={{ width: 120 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center text-muted p-4">{loading ? 'Loading...' : 'No configurations yet'}</td>
                      </tr>
                    )}
                    {items.map((row) => (
                      <tr key={row.id}>
                        <td>{row.level}</td>
                        <td className="text-end">{row.no_of_beds || 0}</td>
                        <td>
                          {Array.isArray(row.health_care_services) ? (
                            <span className="badge-list">
                              {row.health_care_services.map((s, idx) => (
                                <span className="badge bg-light text-dark me-1 mb-1" key={idx}>{s}</span>
                              ))}
                            </span>
                          ) : null}
                        </td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(row)}>
                              <i className="fas fa-edit" />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row.id)}>
                              <i className="fas fa-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Services