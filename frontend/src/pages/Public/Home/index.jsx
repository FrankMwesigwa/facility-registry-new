import React, { Fragment, useEffect, useState } from 'react'
import './styles.css'
import API from '../../../helpers/api'

const Home = () => {
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
    const fetchData = async () => {
      try {
        const [statsRes, summaryRes] = await Promise.all([
          API.get('/mfl/stats'),
          API.get('/mfl/summary/level-ownership'),
        ])
        setStats(statsRes.data)
        setSummary(summaryRes.data || [])
      } catch (e) {
        // ignore on public home
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <Fragment>
      <div class="container">
        <div class="page-title-card">
          <h1 class="page-title">Uganda National Health Facility Registry</h1>
          <p class="page-description">
            Welcome to the Uganda National Health Facility Registry. The Registry is a complete listing of both public and private health facilities in the country. There are <span class="highlight-number">{loading ? '—' : stats.totalFacilities.toLocaleString()}</span> health facilities and each are established under unique administrative units i.e. Region, district, health sub-district, and subcounty etc. The need to uniquely identify health facilities in the country is of paramount importance for better health service delivery.
          </p>
        </div>
      </div>

      <section class="stats-section">
        <div class="container">
          <h2>Health Facility Statistics</h2>
          <div class="row g-2">
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon total">
                  <i class="fas fa-hospital"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.totalFacilities.toLocaleString()}</div>
                <div class="stats-label">Total Facilities</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon government">
                  <i class="fas fa-building"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.government.toLocaleString()}</div>
                <div class="stats-label">Government</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon pnfp">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.pnfp.toLocaleString()}</div>
                <div class="stats-label">PNFP</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon pfp">
                  <i class="fas fa-building"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.private.toLocaleString()}</div>
                <div class="stats-label">PFP</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon functional">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.functional.toLocaleString()}</div>
                <div class="stats-label">Functional</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon non-functional">
                  <i class="fas fa-times-circle"></i>
                </div>
                <div class="stats-number">{loading ? '—' : stats.nonFunctional.toLocaleString()}</div>
                <div class="stats-label">Non Functional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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



    </Fragment>
  )
}

export default Home