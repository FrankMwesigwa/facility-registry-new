import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
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
  const [regions, setRegions] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

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

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await API.get('/mfl/regions')
        const formattedRegions = response.data.map(region => ({
          value: region.id,
          label: region.name
        }))
        setRegions(formattedRegions)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }
    fetchRegions()
  }, [])

  // Fetch districts when region is selected
  useEffect(() => {
    if (selectedRegion) {
      const fetchDistricts = async () => {
        try {
          const response = await API.get(`/mfl/districts?region_id=${selectedRegion.value}`)
          const formattedDistricts = response.data.map(district => ({
            value: district.id,
            label: district.name
          }))
          setDistricts(formattedDistricts)
          setSelectedDistrict(null) // Reset district when region changes
        } catch (error) {
          console.error('Error fetching districts:', error)
        }
      }
      fetchDistricts()
    } else {
      setDistricts([])
      setSelectedDistrict(null)
    }
  }, [selectedRegion])

  // Fetch summary with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        if (selectedRegion) {
          queryParams.append('region_id', selectedRegion.value)
        }
        if (selectedDistrict) {
          queryParams.append('district_id', selectedDistrict.value)
        }
        const { data } = await API.get(`/mfl/summary/level-ownership?${queryParams.toString()}`)
        setSummary(data)
      } catch (e) {
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedRegion, selectedDistrict])

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
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Region</label>
                  <Select
                    value={selectedRegion}
                    options={regions}
                    onChange={setSelectedRegion}
                    isClearable
                    isSearchable
                    classNamePrefix="react-select"
                    placeholder="Select a region..."
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">District</label>
                  <Select
                    value={selectedDistrict}
                    options={districts}
                    onChange={setSelectedDistrict}
                    isClearable
                    isSearchable
                    isDisabled={!selectedRegion}
                    classNamePrefix="react-select"
                    placeholder="Select a district..."
                  />
                </div>
              </div>
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
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center">Loading...</td>
                      </tr>
                    ) : summary.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">No data available</td>
                      </tr>
                    ) : (
                      summary.map((row) => (
                        <tr key={row.level}>
                          <td><strong>{row.level}</strong></td>
                          <td class="text-center">{(row.GOV || 0).toLocaleString()}</td>
                          <td class="text-center">{(row.PFP || 0).toLocaleString()}</td>
                          <td class="text-center">{(row.PNFP || 0).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
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