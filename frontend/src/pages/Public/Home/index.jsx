import React, { Fragment } from 'react'
import './styles.css'

const Home = () => {
  return (
    <Fragment>
      <div class="container">
        <div class="page-title-card">
          <h1 class="page-title">Uganda National Health Facility Registry</h1>
          <p class="page-description">
            Welcome to the Uganda National Health Facility Registry. The Registry is a complete listing of both public and private health facilities in the country. There are <span class="highlight-number">6,680</span> health facilities and each are established under unique administrative units i.e. Region, district, health sub-district, and subcounty etc. The need to uniquely identify health facilities in the country is of paramount importance for better health service delivery.
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
                <div class="stats-number">6,680</div>
                <div class="stats-label">Total Facilities</div>
                <div class="stats-description">Across all regions</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon government">
                  <i class="fas fa-building"></i>
                </div>
                <div class="stats-number">3,442</div>
                <div class="stats-label">Government</div>
                <div class="stats-description">Public facilities</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon pnfp">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="stats-number">975</div>
                <div class="stats-label">PNFP</div>
                <div class="stats-description">Not for profit</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon pfp">
                  <i class="fas fa-building"></i>
                </div>
                <div class="stats-number">2,263</div>
                <div class="stats-label">PFP</div>
                <div class="stats-description">For profit</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon functional">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="stats-number">2,263</div>
                <div class="stats-label">Functional</div>
                <div class="stats-description">Active facilities</div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="stats-card">
                <div class="stat-icon non-functional">
                  <i class="fas fa-times-circle"></i>
                </div>
                <div class="stats-number">2,263</div>
                <div class="stats-label">Non Functional</div>
                <div class="stats-description">Inactive facilities</div>
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
                    <th class="text-center">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>General Hospital</strong></td>
                    <td class="text-center">54</td>
                    <td class="text-center">65</td>
                    <td class="text-center">75</td>
                    <td class="text-center"><strong>194</strong></td>
                  </tr>
                  <tr>
                    <td><strong>HC II</strong></td>
                    <td class="text-center">1,704</td>
                    <td class="text-center">1,459</td>
                    <td class="text-center">453</td>
                    <td class="text-center"><strong>3,616</strong></td>
                  </tr>
                  <tr>
                    <td><strong>HC III</strong></td>
                    <td class="text-center">1,450</td>
                    <td class="text-center">249</td>
                    <td class="text-center">358</td>
                    <td class="text-center"><strong>2,057</strong></td>
                  </tr>
                  <tr>
                    <td><strong>HC IV</strong></td>
                    <td class="text-center">200</td>
                    <td class="text-center">28</td>
                    <td class="text-center">37</td>
                    <td class="text-center"><strong>265</strong></td>
                  </tr>
                  <tr>
                    <td><strong>NRH</strong></td>
                    <td class="text-center">8</td>
                    <td class="text-center">0</td>
                    <td class="text-center">0</td>
                    <td class="text-center"><strong>8</strong></td>
                  </tr>
                  <tr>
                    <td><strong>RRB</strong></td>
                    <td class="text-center">4</td>
                    <td class="text-center">0</td>
                    <td class="text-center">0</td>
                    <td class="text-center"><strong>4</strong></td>
                  </tr>
                  <tr>
                    <td><strong>RRH</strong></td>
                    <td class="text-center">17</td>
                    <td class="text-center">0</td>
                    <td class="text-center">0</td>
                    <td class="text-center"><strong>17</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Specialized Hospital</strong></td>
                    <td class="text-center">1</td>
                    <td class="text-center">0</td>
                    <td class="text-center">0</td>
                    <td class="text-center"><strong>1</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Private Clinic</strong></td>
                    <td class="text-center">4</td>
                    <td class="text-center">462</td>
                    <td class="text-center">52</td>
                    <td class="text-center"><strong>518</strong></td>
                  </tr>
                  <tr class="total-row">
                    <td><strong>TOTAL</strong></td>
                    <td class="text-center"><strong>3,442</strong></td>
                    <td class="text-center"><strong>2,263</strong></td>
                    <td class="text-center"><strong>975</strong></td>
                    <td class="text-center"><strong>6,680</strong></td>
                  </tr>
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