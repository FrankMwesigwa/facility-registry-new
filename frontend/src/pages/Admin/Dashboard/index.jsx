import React, { Fragment } from 'react'
import './styles.css'

const Dashboard = () => {
  return (
    <Fragment>
      <div className="container dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Admin Dashboard</h2>
            <p className="text-muted mb-0">Overview of health facility registry system</p>
          </div>
          <div>
            <span className="badge bg-success">System Online</span>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dc3545' }}>
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-number">6,680</div>
              <div className="stat-label">Total Facilities</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#0d6efd' }}>
                <i className="fas fa-university"></i>
              </div>
              <div className="stat-number">3,442</div>
              <div className="stat-label">Government</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fd7e14' }}>
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-number">975</div>
              <div className="stat-label">PNFP</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#198754' }}>
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-number">2,263</div>
              <div className="stat-label">Private</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#20c997' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-number">6,425</div>
              <div className="stat-label">Functional</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#6f42c1' }}>
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-number">1,247</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-history"></i>
                  Recent Activities
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table activity-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Facility</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>10:30 AM</td>
                        <td>Dr. Sarah Nakamya</td>
                        <td>Updated facility info</td>
                        <td>Frank Health Center IV</td>
                        <td><span className="badge bg-success status-badge">Completed</span></td>
                      </tr>
                      <tr>
                        <td>09:45 AM</td>
                        <td>Admin User</td>
                        <td>Approved new facility</td>
                        <td>Kampala Medical Center</td>
                        <td><span className="badge bg-success status-badge">Approved</span></td>
                      </tr>
                      <tr>
                        <td>09:15 AM</td>
                        <td>John Mukasa</td>
                        <td>Submitted facility request</td>
                        <td>Nakawa Health Center</td>
                        <td><span className="badge bg-warning status-badge">Pending</span></td>
                      </tr>
                      <tr>
                        <td>08:30 AM</td>
                        <td>System</td>
                        <td>Data backup completed</td>
                        <td>-</td>
                        <td><span className="badge bg-info status-badge">System</span></td>
                      </tr>
                      <tr>
                        <td>08:00 AM</td>
                        <td>Mary Achieng</td>
                        <td>User registration</td>
                        <td>-</td>
                        <td><span className="badge bg-success status-badge">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-exclamation-triangle"></i>
                  Pending Requests
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 p-2" style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>New Facility Registration</div>
                    <small className="text-muted">Submitted 2 hours ago</small>
                  </div>
                  <span className="badge bg-warning">12</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 p-2" style={{ background: '#d1ecf1', borderLeft: '4px solid #17a2b8' }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>Facility Updates</div>
                    <small className="text-muted">Requires approval</small>
                  </div>
                  <span className="badge bg-info">8</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3 p-2" style={{ background: '#f8d7da', borderLeft: '4px solid #dc3545' }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>System Alerts</div>
                    <small className="text-muted">Requires attention</small>
                  </div>
                  <span className="badge bg-danger">3</span>
                </div>

                <div className="d-flex justify-content-between align-items-center p-2" style={{ background: '#d4edda', borderLeft: '4px solid #28a745' }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>User Verifications</div>
                    <small className="text-muted">Account approvals</small>
                  </div>
                  <span className="badge bg-success">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Dashboard