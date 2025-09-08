import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'

const emptyForm = { name: '', url: '', api_key: '', secret: '', is_active: true }

const NewSystem = () => {
  const history = useHistory()
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  const generateRandomHex = (bytes = 24) => {
    const arr = new Uint8Array(bytes)
    window.crypto.getRandomValues(arr)
    return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const onGenerateApiKey = () => {
    setForm((s) => ({ ...s, api_key: generateRandomHex(16) }))
  }

  const onGenerateSecret = () => {
    setForm((s) => ({ ...s, secret: generateRandomHex(32) }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        url: form.url.trim(),
        api_key: form.api_key.trim() || undefined,
        secret: form.secret.trim(),
        is_active: !!form.is_active,
      }
      await API.post('/systems', payload)
      history.push('/admin/systems')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.5rem' }}>Add System</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Register a system to receive webhook updates</p>
        </div>
        <div>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => history.push('/admin/systems')}>
            <i className="fas fa-arrow-left" /> Back
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">System name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={onChange} placeholder="e.g., District HMIS" required />
            </div>

            <div className="mb-3">
              <label className="form-label">Webhook base URL</label>
              <input type="url" className="form-control" name="url" value={form.url} onChange={onChange} placeholder="https://example.com" required />
              <small className="text-muted">We will POST to [url]/webhook</small>
            </div>

            <div className="mb-3">
              <label className="form-label">API Key (optional)</label>
              <div className="input-group">
                <input type="text" className="form-control" name="api_key" value={form.api_key} onChange={onChange} placeholder="Leave blank to auto-generate" />
                <button className="btn btn-outline-secondary" type="button" onClick={onGenerateApiKey}>Generate</button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Secret</label>
              <div className="input-group">
                <input type="text" className="form-control" name="secret" value={form.secret} onChange={onChange} placeholder="Used to sign payloads (HMAC SHA256)" required />
                <button className="btn btn-outline-secondary" type="button" onClick={onGenerateSecret}>Generate</button>
              </div>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={onChange} />
              <label className="form-check-label" htmlFor="is_active">Active</label>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => history.push('/admin/systems')} disabled={submitting}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewSystem


