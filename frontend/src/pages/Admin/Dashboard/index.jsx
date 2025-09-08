import React, { Fragment, useEffect, useState } from 'react'
import './styles.css'
import API from '../../../helpers/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFacilities: 0,
    government: 0,
    pnfp: 0,
    private: 0,
    functional: 0,
    nonFunctional: 0,
  })
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/mfl/stats')
        setStats(data)
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get('/mfl/summary/level-ownership')
        setSummary(data)
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Fragment>
      <div className="container dashboard-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Admin Dashboard</h2>
            <p className="text-muted mb-0">Overview of health facility registry system</p>
          </div>
          {/* <div>
            <span className="badge bg-success">System Online</span>
          </div> */}
        </div>

        <div className="row mb-4">
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dc3545' }}>
                <i className="fas fa-building"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.totalFacilities.toLocaleString()}</div>
              <div className="stat-label">Total Facilities</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#0d6efd' }}>
                <i className="fas fa-university"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.government.toLocaleString()}</div>
              <div className="stat-label">Government</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fd7e14' }}>
                <i className="fas fa-heart"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.pnfp.toLocaleString()}</div>
              <div className="stat-label">PNFP</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#198754' }}>
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.private.toLocaleString()}</div>
              <div className="stat-label">Private</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#20c997' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.functional.toLocaleString()}</div>
              <div className="stat-label">Functional</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#6c757d' }}>
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-number">{loading ? '—' : stats.nonFunctional.toLocaleString()}</div>
              <div className="stat-label">Non-Functional</div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="content-section">
            <div class="section-header">
              <h5 class="section-title">
                <i class="fas fa-table"></i>
                Summary of Health Facilities By Level and Ownership
              </h5>
            </div>
            <div class="section-body">
              <div class="table-responsive">
                <table class="table summary-table">
                  <thead>
                    <tr>
                      <th>FACILITY LEVEL</th>
                      <th class="text-center">GOVERNMENT</th>
                      <th class="text-center">PRIVATE FOR PROFIT</th>
                      <th class="text-center">PRIVATE NOT FOR PROFIT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((row) => (
                      <tr key={row.level}>
                        <td><strong>{row.level}</strong></td>
                        <td class="text-center">{(row.GOV || 0).toLocaleString()}</td>
                        <td class="text-center">{(row.PFP || 0).toLocaleString()}</td>
                        <td class="text-center">{(row.PNFP || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Fragment>
  )
}

export default Dashboard