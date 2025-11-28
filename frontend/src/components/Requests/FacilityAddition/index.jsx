import React, { Fragment, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import API from '../../../helpers/api'
import { toast } from 'react-toastify'
import './styles.css'

const AdditionRequest = ({url, link, role}) => {
    const history = useHistory()
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        ownership: '',
        authority: '',
        licensed: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_personemail: '',
        contact_personmobile: '',
        contact_personname: '',
        contact_persontitle: '',
        date_opened: '',
        bed_capacity: '',
        services: [],
        region_id: null,
        district_id: null,
        subcounty_id: null,
        role: `${role}`,
        request_type: 'Facility_Addition'
    })

    const [regions, setRegions] = useState([])
    const [districts, setDistricts] = useState([])
    const [subCounties, setSubCounties] = useState([])
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('basic')
    const [files, setFiles] = useState({
        operating_license: null,
        district_letter: null
    })

    useEffect(() => {
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

    const fetchDistricts = async (regionId) => {
        try {
            const response = await API.get(`/adminunits/districts?id=${regionId}`)
            const formattedDistricts = response.data.map(district => ({
                value: district.id,
                label: district.name
            }))
            setDistricts(formattedDistricts)
        } catch (error) {
            console.error('Error fetching districts:', error)
            toast.error('Failed to fetch districts')
        }
    }

    const fetchSubCounties = async (districtId) => {
        try {
            const response = await API.get(`/adminunits/subcounties?id=${districtId}`)
            const formattedSubCounties = response.data.map(subCounty => ({
                value: subCounty.id,
                label: subCounty.name
            }))
            setSubCounties(formattedSubCounties)
        } catch (error) {
            console.error('Error fetching sub-counties:', error)
            toast.error('Failed to fetch sub-counties')
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            if (name === 'services') {
                const updatedServices = checked
                    ? [...formData.services, value]
                    : formData.services.filter(service => service !== value)
                setFormData(prev => ({ ...prev, services: updatedServices }))
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption }))
    }

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target
        if (fileList && fileList[0]) {
            setFiles(prev => ({ ...prev, [name]: fileList[0] }))
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
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const submitData = new FormData()
            
            // Add form fields
            Object.keys(formData).forEach(key => {
                if (key === 'region_id' || key === 'district_id' || key === 'subcounty_id') {
                    if (formData[key]) {
                        submitData.append(key, formData[key].value)
                    }
                } else if (key === 'services') {
                    submitData.append(key, JSON.stringify(formData[key]))
                } else {
                    submitData.append(key, formData[key])
                }
            })

            // Add files
            Object.keys(files).forEach(key => {
                if (files[key]) {
                    submitData.append(key, files[key])
                }
            })

            const token = localStorage.getItem('token')
            await API.post(`/${url}`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })

            toast.success('Facility request submitted successfully!')
                history.push(`/${link}`)
        } catch (error) {
            console.error('Error submitting request:', error)
            toast.error(error.response?.data?.error || 'Failed to submit request')
        } finally {
            setLoading(false)
        }
    }

    const nextTab = () => {
        const tabs = ['basic', 'location', 'contact', 'services', 'documents']
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1])
        }
    }

    const previousTab = () => {
        const tabs = ['basic', 'location', 'contact', 'services', 'documents']
        const currentIndex = tabs.indexOf(activeTab)
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1])
        }
    }

    return (
        <Fragment>
            <div className="container mt-5 pt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>Add Facility Request</h2>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Submit a new health facility registration request</p>
                    </div>
                    <div>
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => window.history.back()}>
                            <i className="fas fa-arrow-left"></i> Back to Requests
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <ul className="nav nav-tabs mb-4" id="facilityTabs" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={() => setActiveTab('basic')}>
                                <i className="fas fa-info-circle me-1"></i>Basic Information
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === 'location' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={() => setActiveTab('location')}>
                                <i className="fas fa-map-marker-alt me-1"></i>Location
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={() => setActiveTab('contact')}>
                                <i className="fas fa-phone me-1"></i>Contact
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === 'services' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={() => setActiveTab('services')}>
                                <i className="fas fa-heartbeat me-1"></i>Services
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`} 
                                    type="button" 
                                    onClick={() => setActiveTab('documents')}>
                                <i className="fas fa-file-alt me-1"></i>Documents
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content" id="facilityTabContent">
                        <div className={`tab-pane fade ${activeTab === 'basic' ? 'show active' : ''}`} id="basic" role="tabpanel">
                            <div className="form-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-info-circle"></i>
                                        Basic Information
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Facility Name <span className="required">*</span></label>
                                                <input type="text" 
                                                       className="form-control" 
                                                       name="name"
                                                       value={formData.name}
                                                       onChange={handleInputChange}
                                                       required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3"> 
                                                <label className="form-label">Request Type</label>
                                                <select className="form-control" 
                                                        name="request_type"
                                                        value={formData.request_type}
                                                        onChange={handleInputChange}>
                                                    <option value="new_facility">New Facility</option>
                                                    {/* <option value="facility_update">Facility Update</option>
                                                    <option value="closure">Facility Closure</option> */}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Facility Level <span className="required">*</span></label>
                                                <select className="form-control" 
                                                        name="level"
                                                        value={formData.level}
                                                        onChange={handleInputChange}
                                                        required>
                                                    <option value="">Select Level</option>
                                                    <option value="HC II">HC II</option>
                                                    <option value="HC III">HC III</option>
                                                    <option value="HC IV">HC IV</option>
                                                    <option value="HC IV">HC IV</option>
                                                    <option value="Clinic">Clinic</option>
                                                    <option value="General Hospital">General Hospital</option>
                                                    <option value="RRH">Regional Referral Hospital</option>
                                                    <option value="NRH">National Referral Hospital</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Ownership <span className="required">*</span></label>
                                                <select className="form-control" 
                                                        name="ownership"
                                                        value={formData.ownership}
                                                        onChange={handleInputChange}
                                                        required>
                                                    <option value="">Select Ownership</option>
                                                    <option value="PFP">Private For Private</option>
                                                    <option value="PNFP">Private Not For Profit</option>
                                                    <option value="GOV">Government</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Authority <span className="required">*</span></label>
                                                <select className="form-control" 
                                                        name="authority"
                                                        value={formData.authority}
                                                        onChange={handleInputChange}
                                                        required>
                                                    <option value="">Select Authority</option>
                                                    <option value="MOH">Ministry of Health</option>
                                                    <option value="Private Authority">Private Authority</option>
                                                    <option value="UPMB">UPMB</option>
                                                    <option value="UCMB">UCMB</option>
                                                    <option value="UMMB">UMMB</option>
                                                    <option value="NGO">NGO</option>
                                                    <option value="UPF">UPF</option>
                                                    <option value="SOS">SOS</option>
                                                    <option value="BOU">BOU</option>
                                                    <option value="UCBHCA">UCBHCA</option>
                                                    <option value="UNHCR">UNHCR</option>
                                                    <option value="MoES">MoES</option>
                                                    <option value="Local Government">Local Government</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Licensed Status</label>
                                                <select className="form-control" 
                                                        name="licensed"
                                                        value={formData.licensed}
                                                        onChange={handleInputChange}>
                                                    <option value="">Select Status</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                    <option value="Pending">Pending</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Date Opened</label>
                                                <input type="date" 
                                                       className="form-control" 
                                                       name="date_opened"
                                                       value={formData.date_opened}
                                                       onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === 'location' ? 'show active' : ''}`} id="location" role="tabpanel">
                            <div className="form-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-map-marker-alt"></i>
                                        Location Information
                                    </h5>
                                </div>
                                <div className="card-body">
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
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Physical Address</label>
                                                <textarea className="form-control" 
                                                          rows="2"
                                                          name="address"
                                                          value={formData.address}
                                                          onChange={handleInputChange}></textarea>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Latitude</label>
                                                <input type="number" 
                                                       className="form-control" 
                                                       name="latitude"
                                                       value={formData.latitude}
                                                       onChange={handleInputChange}
                                                       placeholder="0.000000" 
                                                       step="any" />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="mb-3">
                                                <label className="form-label">Longitude</label>
                                                <input type="number" 
                                                       className="form-control" 
                                                       name="longitude"
                                                       value={formData.longitude}
                                                       onChange={handleInputChange}
                                                       placeholder="0.000000" 
                                                       step="any" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">Bed Capacity</label>
                                                <input type="number" 
                                                       className="form-control" 
                                                       name="bed_capacity"
                                                       value={formData.bed_capacity}
                                                       onChange={handleInputChange}
                                                       placeholder="Number of beds" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''}`} id="contact" role="tabpanel">
                            <div className="form-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-phone"></i>
                                        Contact Information
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Contact Person Name</label>
                                                <input type="text" 
                                                       className="form-control" 
                                                       name="contact_personname"
                                                       value={formData.contact_personname}
                                                       onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Contact Person Title</label>
                                                <input type="text" 
                                                       className="form-control" 
                                                       name="contact_persontitle"
                                                       value={formData.contact_persontitle}
                                                       onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Contact Person Mobile</label>
                                                <input type="tel" 
                                                       className="form-control" 
                                                       name="contact_personmobile"
                                                       value={formData.contact_personmobile}
                                                       onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Contact Person Email</label>
                                                <input type="email" 
                                                       className="form-control" 
                                                       name="contact_personemail"
                                                       value={formData.contact_personemail}
                                                       onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === 'services' ? 'show active' : ''}`} id="services" role="tabpanel">
                            <div className="form-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-heartbeat"></i>
                                        Services Offered
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Maternity"
                                                       checked={formData.services.includes('Maternity')}
                                                       onChange={handleInputChange}
                                                       id="maternity" />
                                                <label className="form-check-label" htmlFor="maternity">Maternity</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Surgery"
                                                       checked={formData.services.includes('Surgery')}
                                                       onChange={handleInputChange}
                                                       id="surgery" />
                                                <label className="form-check-label" htmlFor="surgery">Surgery</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Emergency"
                                                       checked={formData.services.includes('Emergency')}
                                                       onChange={handleInputChange}
                                                       id="emergency" />
                                                <label className="form-check-label" htmlFor="emergency">Emergency</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Laboratory"
                                                       checked={formData.services.includes('Laboratory')}
                                                       onChange={handleInputChange}
                                                       id="laboratory" />
                                                <label className="form-check-label" htmlFor="laboratory">Laboratory</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Pharmacy"
                                                       checked={formData.services.includes('Pharmacy')}
                                                       onChange={handleInputChange}
                                                       id="pharmacy" />
                                                <label className="form-check-label" htmlFor="pharmacy">Pharmacy</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Radiology"
                                                       checked={formData.services.includes('Radiology')}
                                                       onChange={handleInputChange}
                                                       id="radiology" />
                                                <label className="form-check-label" htmlFor="radiology">Radiology</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Dental"
                                                       checked={formData.services.includes('Dental')}
                                                       onChange={handleInputChange}
                                                       id="dental" />
                                                <label className="form-check-label" htmlFor="dental">Dental</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Mental Health"
                                                       checked={formData.services.includes('Mental Health')}
                                                       onChange={handleInputChange}
                                                       id="mental-health" />
                                                <label className="form-check-label" htmlFor="mental-health">Mental Health</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Nutrition"
                                                       checked={formData.services.includes('Nutrition')}
                                                       onChange={handleInputChange}
                                                       id="nutrition" />
                                                <label className="form-check-label" htmlFor="nutrition">Nutrition</label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Immunization"
                                                       checked={formData.services.includes('Immunization')}
                                                       onChange={handleInputChange}
                                                       id="immunization" />
                                                <label className="form-check-label" htmlFor="immunization">Immunization</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="Family Planning"
                                                       checked={formData.services.includes('Family Planning')}
                                                       onChange={handleInputChange}
                                                       id="family-planning" />
                                                <label className="form-check-label" htmlFor="family-planning">Family Planning</label>
                                            </div>
                                            <div className="form-check mb-2">
                                                <input className="form-check-input" 
                                                       type="checkbox" 
                                                       name="services"
                                                       value="HIV/AIDS"
                                                       checked={formData.services.includes('HIV/AIDS')}
                                                       onChange={handleInputChange}
                                                       id="hiv-aids" />
                                                <label className="form-check-label" htmlFor="hiv-aids">HIV/AIDS</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === 'documents' ? 'show active' : ''}`} id="documents" role="tabpanel">
                            <div className="form-card">
                                <div className="card-header">
                                    <h5 className="card-title">
                                        <i className="fas fa-file-alt"></i>
                                        Supporting Documents
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Operating License</label>
                                                <input type="file" 
                                                       className="form-control" 
                                                       name="operating_license"
                                                       onChange={handleFileChange}
                                                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                                <small className="text-muted">Max 5MB</small>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">District Letter</label>
                                                <input type="file" 
                                                       className="form-control" 
                                                       name="district_letter"
                                                       onChange={handleFileChange}
                                                       accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                                                <small className="text-muted">Max 5MB</small>
                                            </div>
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        <strong>Note:</strong> Please upload relevant supporting documents for your facility request. 
                                        Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-navigation d-flex justify-content-between mt-3">
                        <button type="button" 
                                className="btn btn-outline-secondary" 
                                onClick={previousTab}
                                disabled={activeTab === 'basic'}>
                            <i className="fas fa-arrow-left"></i> Previous
                        </button>
                        <div>
                            {activeTab !== 'documents' && (
                                <button type="button" 
                                        className="btn btn-primary me-2" 
                                        onClick={nextTab}>
                                    Next <i className="fas fa-arrow-right"></i>
                                </button>
                            )}
                            {activeTab === 'documents' && (
                                <button type="submit" 
                                        className="btn btn-success" 
                                        disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check-circle"></i> Submit Request
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default AdditionRequest