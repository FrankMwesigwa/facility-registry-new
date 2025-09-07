import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import API from '../../helpers/api';
import './styles.css';

const Filters = ({ close, onApplyFilters }) => {
    const [filters, setFilters] = useState({
        level: null,
        ownership: null,
        authority: null,
        region_id: null,
        district_id: null,
        sub_county_id: null,
    });

    const [regions, setRegions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subCounties, setSubCounties] = useState([]);

    useEffect(() => {
        fetchRegions();
    }, []);

    useEffect(() => {
        if (filters.region_id) {
            fetchDistricts(filters.region_id.value);
        } else {
            setDistricts([]);
            setFilters(prev => ({ ...prev, district_id: null, sub_county_id: null }));
        }
    }, [filters.region_id]);

    useEffect(() => {
        if (filters.district_id) {
            fetchSubCounties(filters.district_id.value);
        } else {
            setSubCounties([]);
            setFilters(prev => ({ ...prev, sub_county_id: null }));
        }
    }, [filters.district_id]);

    const fetchRegions = async () => {
        try {
            console.log('Fetching regions...');
            const response = await API.get('/adminareas/regions');
            console.log('Regions response:', response);
            const formattedRegions = response.data.map(region => ({
                value: region.id,
                label: region.name
            }));
            setRegions(formattedRegions);
        } catch (error) {
            console.error('Error fetching regions:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
        }
    };

    const fetchDistricts = async (regionId) => {
        try {
            console.log(`Fetching districts for region ${regionId}...`);
            const response = await API.get(`/adminareas/district?region_id=${regionId}`);
            console.log('Districts response:', response);
            const formattedDistricts = response.data.map(district => ({
                value: district.id,
                label: district.name
            }));
            setDistricts(formattedDistricts);
        } catch (error) {
            console.error('Error fetching districts:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
        }
    };

    const fetchSubCounties = async (districtId) => {
        try {
            console.log(`Fetching sub-counties for district ${districtId}...`);
            const response = await API.get(`/adminareas/subcounty?district_id=${districtId}`);
            console.log('Sub-counties response:', response);
            const formattedSubCounties = response.data.map(subCounty => ({
                value: subCounty.id,
                label: subCounty.name
            }));
            setSubCounties(formattedSubCounties);
        } catch (error) {
            console.error('Error fetching sub-counties:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
        }
    };

    const handleFilterChange = (selected, field) => {
        setFilters(prev => ({ ...prev, [field]: selected }));
    };

    const clearFilters = () => {
        setFilters({
            level: null,
            ownership: null,
            authority: null,
            region_id: null,
            district_id: null,
            sub_county_id: null,
        });
    };

    const handleApply = () => {
        const formattedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value.value;
            }
            return acc;
        }, {});

        onApplyFilters(formattedFilters);
        close();
    };

    return (
        <div className="filters-container">
            <div className="filters-content">
                <div className="filters-row">
                    <div className="filters-column">
                        <div className="filter-section">
                            <h4 className="filter-section-title">Facility Details</h4>
                            
                            <div className="filter-group">
                                <label className="filter-label">Facility Level</label>
                                <Select
                                    value={filters.level}
                                    options={[
                                        { value: "NRH", label: "NRH" },
                                        { value: "RRH", label: "RRH" },
                                        { value: "RBB", label: "RBB" },
                                        { value: "HC II", label: "HC II" },
                                        { value: "HC III", label: "HC III" },
                                        { value: "HC IV", label: "HC IV" },
                                        { value: "Clinic", label: "Clinic" },
                                        { value: "Drug Shop", label: "Drug Shop" },
                                        { value: "BCDP", label: "BCDP" },
                                        { value: "General Hospital", label: "General Hospital" },
                                        { value: "Specialized Hospital", label: "Specialized Hospital" },
                                    ]}
                                    onChange={(selected) => handleFilterChange(selected, "level")}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select facility level..."
                                />
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">Ownership</label>
                                <Select
                                    value={filters.ownership}
                                    options={[
                                        { value: "GOV", label: "Government" },
                                        { value: "PFP", label: "Private For Profit" },
                                        { value: "PNFP", label: "Private Not For Profit" },
                                    ]}
                                    onChange={(selected) => handleFilterChange(selected, "ownership")}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select ownership..."
                                />
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">Authority</label>
                                <Select
                                    value={filters.authority}
                                    options={[
                                        { value: "GOV", label: "Government" },
                                        { value: "UPS", label: "Uganda Prisons Service" },
                                        { value: "LG", label: "Local Government" },
                                        { value: "UPDF", label: "Uganda People's Defence Force" },
                                        { value: "UPMB", label: "Uganda Protestant Medical Bureau" },
                                        { value: "UCMB", label: "Uganda Catholic Medical Bureau" },
                                        { value: "Private", label: "Private" },
                                        { value: "NGO", label: "Non-Governmental Organization" },
                                        { value: "MOH", label: "Ministry of Health" },
                                        { value: "UCBHCA", label: "Uganda Community Based Health Care Association" },
                                        { value: "MoES", label: "Ministry of Education and Sports" },
                                        { value: "UMMB", label: "Uganda Muslim Medical Bureau" },
                                        { value: "SDA", label: "Seventh Day Adventist" },
                                        { value: "BOU", label: "Bank of Uganda" },
                                        { value: "UOMB", label: "Uganda Orthodox Medical Bureau" },
                                        { value: "SOS", label: "SOS Children's Villages" },
                                        { value: "UNHCR", label: "United Nations High Commissioner for Refugees" },
                                    ]}
                                    onChange={(selected) => handleFilterChange(selected, "authority")}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select authority..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Location */}
                    <div className="filters-column">
                        <div className="filter-section">
                            <h4 className="filter-section-title">Location</h4>
                            
                            <div className="filter-group">
                                <label className="filter-label">Region</label>
                                <Select
                                    value={filters.region_id}
                                    options={regions}
                                    onChange={(selected) => handleFilterChange(selected, "region_id")}
                                    isClearable
                                    classNamePrefix="react-select"
                                    placeholder="Select region..."
                                />
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">District</label>
                                <Select
                                    value={filters.district_id}
                                    options={districts}
                                    onChange={(selected) => handleFilterChange(selected, "district_id")}
                                    isClearable
                                    isDisabled={!filters.region_id}
                                    classNamePrefix="react-select"
                                    placeholder="Select district..."
                                />
                            </div>

                            <div className="filter-group">
                                <label className="filter-label">Sub County</label>
                                <Select
                                    value={filters.sub_county_id}
                                    options={subCounties}
                                    onChange={(selected) => handleFilterChange(selected, "sub_county_id")}
                                    isClearable
                                    isDisabled={!filters.district_id}
                                    classNamePrefix="react-select"
                                    placeholder="Select sub county..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="filters-footer">
                <button type="button" className="btn btn-secondary" onClick={close}>
                    Cancel
                </button>
                <button type="button" className="btn btn-outline-danger" onClick={clearFilters}>
                    Clear Filters
                </button>
                <button type="button" className="btn btn-primary" onClick={handleApply}>
                    Apply Filters
                </button>
            </div>
        </div>
    )
}

export default Filters