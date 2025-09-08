import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import API from '../../../../helpers/api'
import { useHistory } from "react-router-dom";
import './styles.css'

const FacilityDeactivation = ({role, path}) => {
  const [loading, setLoading] = useState(false);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [supportDocument, setSupportDocument] = useState(null);
  
  const [formData, setFormData] = useState({
    facility_id: null,
    name: '',
    level: '',
    ownership: '',
    authority: '',
    region_id: null,
    district_id: null,
    sub_county_id: null,
    deactivation_reason: '',
    remarks: '',
    role: `${role}`,
  });

  // Region/District/Subcounty are populated from the selected facility

  const history = useHistory();

  useEffect(() => {
    loadFacilities()
  }, [])

  // No dependent selects for region/district/subcounty

  // Removed fetching of region/district/subcounty; these will be set from facility

  const loadFacilities = async () => {
    try {
      setFacilitiesLoading(true);
      const token = localStorage.getItem('token');
      const response = await API.get('/mfl/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Format facilities for react-select
      const facilitiesData = Array.isArray(response.data)
        ? response.data
        : (response.data?.facilities || []);
      const formattedFacilities = facilitiesData.map(facility => ({
        value: facility.facility_id,
        label: facility.name,
        facility: facility
      }));
      
      setFacilities(formattedFacilities);
    } catch (err) {
      console.error('Error loading facilities:', err);
      toast.error('Failed to fetch facilities');
    } finally {
      setFacilitiesLoading(false);
    }
  };

  const handleFacilitySelect = (selectedOption) => {
    if (!selectedOption) {
      setSelectedFacility(null);
      setShowForm(false);
      setFormData({
        facility_id: null,
        name: '',
        level: '',
        ownership: '',
        authority: '',
        region_id: null,
        district_id: null,
        sub_county_id: null,
        deactivation_reason: '',
        remarks: '',
        role: `${role}`
      });
      setSupportDocument(null);
      return;
    }

    const facility = selectedOption.facility;
    setSelectedFacility(selectedOption);

    setFormData(prev => ({
      ...prev,
      facility_id: facility.facility_id ?? facility.id,
      name: facility.name || '',
      level: facility.level || '',
      ownership: facility.ownership || '',
      authority: facility.authority || '',
      region_id: facility.region_id || null,
      district_id: facility.district_id || null,
      sub_county_id: facility.sub_county_id || facility.subcounty_id || null,
      role: `${role}`
    }))
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed');
        e.target.value = '';
        return;
      }
      
      setSupportDocument(file);
    } else {
      setSupportDocument(null);
    }
  };

  const validateForm = () => {
    if (!formData.facility_id) {
      toast.error('Please select a facility');
      return false;
    }
    if (!formData.name.trim()) {
      toast.error('Facility name is required');
      return false;
    }
    if (!formData.level.trim()) {
      toast.error('Facility level is required');
      return false;
    }
    if (!formData.ownership.trim()) {
      toast.error('Facility ownership is required');
      return false;
    }
    if (!formData.authority.trim()) {
      toast.error('Facility authority is required');
      return false;
    }
    // Region/District/Subcounty are populated automatically from selected facility
    if (!formData.deactivation_reason.trim()) {
      toast.error('Deactivation reason is required');
      return false;
    }
    if (!formData.remarks.trim()) {
      toast.error('Deactivation remarks are required');
      return false;
    }
    if (!supportDocument) {
      toast.error('Supporting document is required');
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleConfirmDeactivation = async () => {
    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('facility_id', formData.facility_id);
      submitData.append('name', formData.name);
      submitData.append('level', formData.level);
      submitData.append('ownership', formData.ownership);
      submitData.append('authority', formData.authority);
      submitData.append('role', role);
      submitData.append('region_id', formData.region_id);
      submitData.append('district_id', formData.district_id);
      submitData.append('sub_county_id', formData.sub_county_id);
      submitData.append('deactivation_reason', formData.deactivation_reason);
      submitData.append('remarks', formData.remarks);
      submitData.append('request_type', 'Facility_Deactivation');

      // Add supporting document (required)
      if (supportDocument) {
        submitData.append('support_document', supportDocument);
      }

      const token = localStorage.getItem('token');
      await API.post('/facilityRequests/deactivate', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Facility deactivation request submitted successfully!');
      setShowConfirmModal(false);
      // Reset form
      setSelectedFacility(null);
      setShowForm(false);
      setFormData({
        facility_id: null,
        name: '',
        level: '',
        ownership: '',
        authority: '',
        region_id: null,
        district_id: null,
        sub_county_id: null,
        deactivation_reason: '',
        remarks: '',
        role: `${role}`
      });
      setSupportDocument(null);
      
      // Redirect to requests list or dashboard
      history.push(`/${path}`);
    } catch (error) {
      console.error('Error submitting facility deactivation request:', error);
      toast.error(error.response?.data?.error || 'Failed to submit deactivation request');
    } finally {
      setLoading(false);
    }
  };

  const ConfirmationModal = () => (
    <div className={`modal fade ${showConfirmModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showConfirmModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-exclamation-triangle text-warning me-2"></i>
              Confirm Facility Deactivation
            </h5>
            <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-warning">
              <strong>Warning:</strong> You are about to submit a request to deactivate the following facility:
            </div>
            <div className="facility-info mb-3">
              <h6><strong>Facility:</strong> {selectedFacility?.label}</h6>
              <p><strong>Reason:</strong> {formData.deactivation_reason}</p>
              <p><strong>Remarks:</strong> {formData.remarks}</p>
              {supportDocument && (
                <p><strong>Supporting Document:</strong> {supportDocument.name}</p>
              )}
            </div>
            <p className="text-muted">
              This action will submit a request for review. The facility will remain active until the request is approved by the appropriate authorities.
            </p>
            <p><strong>Are you sure you want to proceed?</strong></p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={handleConfirmDeactivation}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i> Confirm Deactivation Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1" style={{ color: 'var(--primary-color)', fontWeight: '700', fontSize: '1.5rem' }}>
              Request Facility Deactivation
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Submit a request to deactivate a facility
            </p>
          </div>
          <div>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => history.goBack()}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        {/* Facility Selection */}
        <div className="form-card">
          <div className="card-header">
            <h5 className="card-title">
              <i className="fas fa-hospital"></i>
              Select Facility for Deactivation Request
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Choose Facility <span className="required">*</span></label>
              <Select
                options={facilities}
                value={selectedFacility}
                onChange={handleFacilitySelect}
                placeholder={facilitiesLoading ? "Loading facilities..." : "Select a facility for deactivation request"}
                isClearable
                isLoading={facilitiesLoading}
                classNamePrefix="react-select"
              />
            </div>
          </div>
        </div>

        {/* Deactivation Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit}>
            <div className="form-card">
              <div className="card-header">
                <h5 className="card-title">
                  <i className="fas fa-ban"></i>
                  Facility Deactivation Request Form
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Deactivation Reason <span className="required">*</span></label>
                      <select 
                        className="form-control" 
                        name="deactivation_reason"
                        value={formData.deactivation_reason}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Deactivation Reason</option>
                        <option value="Closure due to lack of resources">Closure due to lack of resources</option>
                        <option value="Structural damage/unsafe conditions">Structural damage/unsafe conditions</option>
                        <option value="License revocation">License revocation</option>
                        <option value="Merger with another facility">Merger with another facility</option>
                        <option value="Relocation">Relocation</option>
                        <option value="Non-compliance with regulations">Non-compliance with regulations</option>
                        <option value="Financial difficulties">Financial difficulties</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Deactivation Remarks <span className="required">*</span></label>
                      <textarea 
                        className="form-control" 
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Provide detailed remarks about the deactivation request..."
                        required
                      ></textarea>
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
                        Upload supporting documents for the deactivation request. 
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
                  setSelectedFacility(null);
                  setShowForm(false);
                  setFormData({
                    facility_id: null,
                    name: '',
                    level: '',
                    ownership: '',
                    authority: '',
                    region_id: null,
                    district_id: null,
                    sub_county_id: null,
                    deactivation_reason: '',
                    remarks: '',
                    role: `${role}`
                  });
                  setSupportDocument(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-danger" 
                disabled={loading}
              >
                <i className="fas fa-ban"></i> Submit Deactivation Request
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </Fragment>
  );
};

export default FacilityDeactivation;