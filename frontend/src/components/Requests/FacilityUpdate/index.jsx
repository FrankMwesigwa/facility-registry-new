import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import API from '../../../helpers/api'
import { toast } from 'react-toastify'
import { useHistory } from "react-router-dom";
import './styles.css'

const FacilityUpdate = ({ url, link, role, path }) => {
    const [loading, setLoading] = useState(false)
    const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [facilities, setFacilities] = useState([])
    const [selectedFacility, setSelectedFacility] = useState(null)
    const [showForm, setShowForm] = useState(false)
    
    const [formData, setFormData] = useState({
        facility_id: null,
        name: '',
        level: '',
        ownership: '',
        authority: '',
        region_id: null,
        district_id: null,
        subcounty_id: null,
        role: `${role}`,
    })

      const history = useHistory();

    const [regions, setRegions] = useState([])
    const [districts, setDistricts] = useState([])
    const [subCounties, setSubCounties] = useState([])
    const [supportDocument, setSupportDocument] = useState(null)

    useEffect(() => {
        loadFacilities()
        fetchRegions()
    }, [])

    useEffect(() => {
        if (formData.region_id) {
            fetchDistricts(formData.region_id.value)
        } else {
            setDistricts([])
            setFormData(prev => ({ ...prev, district_id: null, subcounty_id: null }))
        }
    }, [formData.region_id])

    useEffect(() => {
        if (formData.district_id) {
            fetchSubCounties(formData.district_id.value)
        } else {
            setSubCounties([])
            setFormData(prev => ({ ...prev, subcounty_id: null }))
        }
    }, [formData.district_id])

  const loadFacilities = async () => {
      try {
            setFacilitiesLoading(true)
            const token = localStorage.getItem('token')
          const response = await API.get(`/${link}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            
            // Format facilities for react-select
            const facilitiesData = Array.isArray(response.data)
                ? response.data
                : (response.data?.facilities || [])
            const formattedFacilities = facilitiesData.map(facility => ({
                value: facility.facility_id,
                label: facility.name,
                facility: facility
            }))
            
            setFacilities(formattedFacilities)
      } catch (err) {
            console.error('Error loading facilities:', err)
            toast.error('Failed to fetch facilities')
        } finally {
            setFacilitiesLoading(false)
        }
    }

    const fetchRegions = async () => {
        try {
            const response = await API.get('/adminunits/regions')
            const formattedRegions = response.data.map(region => ({
                value: region.id,
                label: region.name
            }))
            setRegions(formattedRegions)
        } catch (error) {
            console.error('Error fetching regions:', error)
            toast.error('Failed to fetch regions')
        }
    }

    const fetchDistricts = async (regionId, preselectDistrictId = null) => {
        try {
            const response = await API.get(`/adminunits/districts?id=${regionId}`)
            const formattedDistricts = response.data.map(district => ({
                value: district.id,
                label: district.name
            }))
            setDistricts(formattedDistricts)
            if (preselectDistrictId) {
                const match = formattedDistricts.find(d => d.value === preselectDistrictId)
                setFormData(prev => ({ ...prev, district_id: match || null }))
            }
        } catch (error) {
            console.error('Error fetching districts:', error)
            toast.error('Failed to fetch districts')
        }
    }

    const fetchSubCounties = async (districtId, preselectSubcountyId = null) => {
        try {
            const response = await API.get(`/adminunits/subcounties?id=${districtId}`)
            const formattedSubCounties = response.data.map(subCounty => ({
                value: subCounty.id,
                label: subCounty.name
            }))
            setSubCounties(formattedSubCounties)
            if (preselectSubcountyId) {
                const match = formattedSubCounties.find(s => s.value === preselectSubcountyId)
                setFormData(prev => ({ ...prev, subcounty_id: match || null }))
            }
        } catch (error) {
            console.error('Error fetching sub-counties:', error)
            toast.error('Failed to fetch sub-counties')
        }
    }

    const handleFacilitySelect = async (selectedOption) => {
        if (!selectedOption) {
            setSelectedFacility(null)
            setShowForm(false)
            setFormData({
                facility_id: null,
                name: '',
                level: '',
                ownership: '',
                authority: '',
                region_id: null,
                district_id: null,
                subcounty_id: null,
                role: role,
            })
            setSupportDocument(null)
            return
        }

        const facility = selectedOption.facility
        setSelectedFacility(selectedOption)
        
        // Find matching region, district, and subcounty options
        const regionOption = regions.find(r => r.value === facility.region_id)
        // Defer district/subcounty selection until options are loaded

        setFormData({
            facility_id: facility.facility_id ?? facility.id,
            name: facility.name || '',
            level: facility.level || '',
            ownership: facility.ownership || '',
            authority: facility.authority || '',
            region_id: regionOption || null,
            district_id: null,
            subcounty_id: null,
            role: role,
        })
        
        setShowForm(true)

        // If we have region/district info on the facility, load and preselect
        if (facility.region_id) {
            await fetchDistricts(facility.region_id, facility.district_id)
        }
        if (facility.district_id) {
            await fetchSubCounties(facility.district_id, facility.subcounty_id || facility.sub_county_id)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB')
                e.target.value = ''
                return
            }
            
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed')
                e.target.value = ''
                return
            }
            
            setSupportDocument(file)
        } else {
            setSupportDocument(null)
        }
    }

    const validateForm = () => {
        const requiredFields = ['name', 'level', 'ownership', 'authority']
        for (let field of requiredFields) {
            if (!formData[field]) {
                toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`)
                return false
            }
        }
        if (!formData.region_id) {
            toast.error('Region is required')
            return false
        }
        if (!supportDocument) {
            toast.error('Supporting document is required')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const submitData = new FormData()
            
            // Add form fields
            submitData.append('facility_id', formData.facility_id)
            submitData.append('name', formData.name)
            submitData.append('level', formData.level)
            submitData.append('ownership', formData.ownership)
            submitData.append('authority', formData.authority)
            submitData.append('role', role)
            submitData.append('request_type', 'Facility_Update')
            
            if (formData.region_id) {
                submitData.append('region_id', formData.region_id.value)
            }
            if (formData.district_id) {
                submitData.append('district_id', formData.district_id.value)
            }
            if (formData.subcounty_id) {
                submitData.append('sub_county_id', formData.subcounty_id.value)
            }

            // Add supporting document if uploaded
            if (supportDocument) {
                submitData.append('support_document', supportDocument)
            }

            const token = localStorage.getItem('token')
            await API.post('/facilityrequests/update', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            console.log("Role ====>", submitData)

            toast.success('Facility update request submitted successfully!')
            history.push(`/${path}`);
            setSelectedFacility(null)
            setShowForm(false)
            setSupportDocument(null)
        } catch (error) {
            console.error('Error submitting facility update request:', error)
            toast.error(error.response?.data?.error || 'Failed to submit update request')
      } finally {
            setLoading(false)
        }
      }

  return (
        <Fragment>
            <div className="container mt-5 pt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>
                            Request Facility Update
                        </h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Submit a request to update facility information
                        </p>
                    </div>
                    <div>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => window.history.back()}>
                            <i className="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>

                {/* Facility Selection */}
                <div className="form-card">
                    <div className="card-header">
                        <h5 className="card-title">
                            <i className="fas fa-hospital"></i>
                            Select Facility for Update Request
                        </h5>
                    </div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Choose Facility <span className="required">*</span></label>
                            <Select
                                options={facilities}
                                value={selectedFacility}
                                onChange={handleFacilitySelect}
                                placeholder={facilitiesLoading ? "Loading facilities..." : "Select a facility for update request"}
                                isClearable
                                isLoading={facilitiesLoading}
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>
                </div>

                {/* Update Form */}
                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-card">
                            <div className="card-header">
                                <h5 className="card-title">
                                    <i className="fas fa-edit"></i>
                                    Facility Update Request Form
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Facility Name <span className="required">*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Facility Level <span className="required">*</span></label>
                                            <select 
                                                className="form-control" 
                                                name="level"
                                                value={formData.level}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Level</option>
                                                <option value="HC I">HC I</option>
                                                <option value="HC II">HC II</option>
                                                <option value="HC III">HC III</option>
                                                <option value="HC IV">HC IV</option>
                                                <option value="General Hospital">General Hospital</option>
                                                <option value="National Hospital">National Hospital</option>
                                                <option value="Specialized Hospital">Specialized Hospital</option>
                                                <option value="Private Clinic">Private Clinic</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Ownership <span className="required">*</span></label>
                                            <select 
                                                className="form-control" 
                                                name="ownership"
                                                value={formData.ownership}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Ownership</option>
                                                <option value="Government">Government</option>
                                                <option value="Private For Profit">Private For Profit</option>
                                                <option value="Private Not For Profit">Private Not For Profit</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Authority <span className="required">*</span></label>
                                            <select 
                                                className="form-control" 
                                                name="authority"
                                                value={formData.authority}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Authority</option>
                                                <option value="MoH">Ministry of Health</option>
                                                <option value="District">District</option>
                                                <option value="Private">Private</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Region <span className="required">*</span></label>
                                            <Select
                                                options={regions}
                                                value={formData.region_id}
                                                onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'region_id' })}
                                                placeholder="Select Region"
                                                isClearable
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">District</label>
                                            <Select
                                                options={districts}
                                                value={formData.district_id}
                                                onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'district_id' })}
                                                placeholder="Select District"
                                                isClearable
                                                isDisabled={!formData.region_id}
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label">Sub County</label>
                                            <Select
                                                options={subCounties}
                                                value={formData.subcounty_id}
                                                onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'subcounty_id' })}
                                                placeholder="Select Sub County"
                                                isClearable
                                                isDisabled={!formData.district_id}
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Supporting Document Section */}
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="mb-3">
                                            <label className="form-label">Supporting Document</label>
                                            <input 
                                                type="file" 
                                                className="form-control" 
                                                name="support_document"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                required
                                            />
                                            <small className="text-muted">
                                                Upload supporting documents for the update request. 
                                                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                                            </small>
                                            {supportDocument && (
                                                <div className="mt-2">
                                                    <small className="text-success">
                                                        <i className="fas fa-file"></i> Selected: {supportDocument.name}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-navigation d-flex justify-content-end mt-3">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary me-2" 
                                onClick={() => {
                                    setSelectedFacility(null)
                                    setShowForm(false)
                                    setSupportDocument(null)
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-success" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting Request...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i> Submit Update Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Fragment>
  )
}

export default FacilityUpdate