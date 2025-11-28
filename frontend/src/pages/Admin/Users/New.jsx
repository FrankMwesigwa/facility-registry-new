import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from '../../../helpers/api'

const initialState = {
  firstname: '',
  lastname: '',
  email: '',
  username: '',
  password: '',
  phoneno: '',
  organisation: '',
  district_id: ''
}

const AddUser = () => {
  const history = useHistory()
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await API.post('/users', form)
      history.push('/admin/users')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
  <div className="container mt-5 pt-5">
     

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>Add New User</h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Create a new registry user</p>
        </div>
        <div>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => history.push('/admin/users')}>
            <i className="fas fa-arrow-left"></i> Back to Users
          </button>
        </div>
      </div>
            <div className="form-card">
          <div className="card-header">
            <h5 className="card-title">
              <i className="fas fa-user-plus"></i>
              User Details
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">First name</label>
                  <input className="form-control" name="firstname" value={form.firstname} onChange={onChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Last name</label>
                  <input className="form-control" name="lastname" value={form.lastname} onChange={onChange} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input className="form-control" name="username" value={form.username} onChange={onChange} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Phone number</label>
                  <input className="form-control" name="phoneno" value={form.phoneno} onChange={onChange} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Organisation</label>
                  <input className="form-control" name="organisation" value={form.organisation} onChange={onChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">District</label>
                  <input className="form-control" name="district_id" value={form.district_id} onChange={onChange} required />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        </div>

        <div className="row justify-content-center mt-3">
          <div className="col-12 col-lg-10 d-flex justify-content-between">
            <button className="btn btn-outline-secondary" type="button" onClick={() => history.push('/admin/users')} disabled={submitting}>
              Cancel
            </button>
            <button className="btn btn-success" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i> Save User
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddUser


