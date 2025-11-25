import React, { useState, useEffect, Fragment, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom';
import API from "../../helpers/api";
import FNModal from "../../components/FNModal";
import Filters from "./Filters";
import './styles.css'
import Search from "./Search";

const FacilityList = ({ url, link, showUpload = false }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [clearSignal, setClearSignal] = useState(0);
    const [paging, setPaging] = useState(false);
    const fileRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const ITEMS_PER_PAGE = 20;
    
    const [pagination, setPagination] = useState({
        page: 1,
        limit: ITEMS_PER_PAGE,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                ...(filterValue && { search: filterValue }),
                ...activeFilters
            }).toString();

            const token = localStorage.getItem('token');
            const response = await API.get(`/${link}?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const transformedData = (response?.data?.facilities || []).map(facility => ({
                id: facility.id,
                facility_id: (facility.nhfrid || facility.uid || String(facility.id)).toString(),
                facility_name: facility.name,
                level: facility.level,
                ownership: facility.ownership,
                authority: facility.authority,
                subcounty: facility?.SubCounty?.name || "",
                district: facility?.District?.name || "",
                region: facility?.Region?.name || "",
            }));

            setData(transformedData);
            
            // Use pagination metadata from backend response
            if (response?.data?.pagination) {
                setPagination({
                    page: response.data.pagination.page,
                    limit: response.data.pagination.limit,
                    total: response.data.pagination.total,
                    totalPages: response.data.pagination.totalPages,
                    hasNextPage: response.data.pagination.hasNextPage,
                    hasPreviousPage: response.data.pagination.hasPreviousPage
                });
            } else {
                // Fallback for backward compatibility
                const total = response?.data?.results || 0;
                const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
                setPagination({
                    page: page,
                    limit: ITEMS_PER_PAGE,
                    total: total,
                    totalPages: totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [filterValue, activeFilters, link]);

    const downloadData = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                search: filterValue,
                ...activeFilters
            }).toString();

            const token = localStorage.getItem('token');
            const response = await API.get(`/mfl?export=all&${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const transformedData = response.data.facilities.map(facility => ({
                id: facility.id,
                facility_id: (facility.nhfrid || facility.uid || String(facility.id)).toString(),
                facility_name: facility.name,
                name: facility.name,
                shortname: facility.shortname || "",
                longtitude: facility.longtitude || "",
                latitude: facility.latitude || "",
                status: facility.status || "",
                level: facility.level,
                ownership: facility.ownership,
                authority: facility.authority,
                subcounty: facility?.SubCounty?.name || "",
                district: facility?.District?.name || "",
                region: facility?.Region?.name || "",
            }));

            return transformedData;
        } catch (error) {
            console.error('Error loading data:', error);
            return [];
        }
    }, [filterValue, activeFilters]);

    useEffect(() => {
        fetchData(pagination.page);
    }, [activeFilters, pagination.page, fetchData]);
    
    // Reset paging state when fetch completes
    useEffect(() => {
        if (!loading) {
            setPaging(false);
        }
    }, [loading]);

    const handleFilterChange = (value) => {
        setFilterValue(value);
        setPagination(prev => ({ ...prev, page: 1 }));
        // The useEffect will trigger fetchData when filterValue changes
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page) => {
        if (page < 1 || (pagination.totalPages > 0 && page > pagination.totalPages)) return;
        setPaging(true);
        setPagination(prev => ({ ...prev, page: page }));
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearAll = () => {
        setActiveFilters({});
        setFilterValue("");
        setPagination(prev => ({ ...prev, page: 1 }));
        setClearSignal(prev => prev + 1);
        // The useEffect will trigger fetchData when filters are cleared
    };

    const handleExportExcel = async () => {
        setExporting(true);
        try {
            const rows = await downloadData();
            const exportRows = rows.map(({ id, facility_name, ...rest }) => rest);
            const worksheet = XLSX.utils.json_to_sheet(exportRows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Facilities");
            XLSX.writeFile(workbook, "uganda_mfl.xlsx");
        } finally {
            setExporting(false);
        }
    };

    const onClickUpload = () => fileRef.current?.click();
    const onFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const lower = (file.name || '').toLowerCase();
        if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
            setUploadMsg('Please select an Excel file (.xlsx or .xls)');
            if (fileRef.current) fileRef.current.value = '';
            return;
        }
        setUploadMsg("");
        setUploading(true);
        try {
            // Parse CSV/Excel in browser and send chunks as JSON
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const allRows = XLSX.utils.sheet_to_json(sheet, { defval: null });

            const token = localStorage.getItem('token');
            const chunkSize = 1000;
            let totalInserted = 0;
            let totalUpdated = 0;
            for (let i = 0; i < allRows.length; i += chunkSize) {
                const chunk = allRows.slice(i, i + chunkSize);
                const { data } = await API.post('/mfl/upload/chunk', { rows: chunk }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                totalInserted += data.inserted || 0;
                totalUpdated += data.updated || 0;
            }
            setUploadMsg(`Upload completed: inserted ${totalInserted}, updated ${totalUpdated}`);
            // Reset to page 1 and refresh - useEffect will trigger fetchData
            setPagination(prev => ({ ...prev, page: 1 }));
        } catch (err) {
            setUploadMsg(err.response?.data?.error || err.message);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    return (
        <Fragment>
            <FNModal
                showModal={showModal}
                handleClose={handleClose}
                lg="lg"
                title="Filter Health Facilities"
            >
                <Filters close={handleClose} onApplyFilters={handleApplyFilters} />
            </FNModal>
            <div class="breadcrumb-section">
                <div class="container pt-5">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="home.html">Home</a></li>
                            <li class="breadcrumb-item active">Master Facility List</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="container">
                <div class="page-title-card" style={{ padding: '1.5rem 1rem' }}>
                    <div class="row align-items-center">
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <Search
                                    onFilterChange={handleFilterChange}
                                    filterValue={filterValue}
                                    clearSignal={clearSignal}
                                />
                            </div>
                            <div class="col-md-4 text-end mt-3 mt-md-0" style={{ padding: '0 1rem' }}>
                                <button class="btn btn-filter-apply btn-sm me-2" onClick={handleShow}>
                                    <i class="fas fa-filter me-1"></i> Apply Filters
                                </button>
                                <button class="btn btn-filter-clear btn-sm" onClick={handleClearAll}>Clear Filters</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="content-section">
                    <div class="section-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="section-title">
                                <i class="fas fa-hospital"></i>
                                Health Facilities
                                <span class="facility-count">({pagination.total} total)</span>
                            </h5>
                            <div class="export-buttons d-flex align-items-center">
                                {showUpload && (
                                    <>
                                        <input type="file" ref={fileRef} accept=".xlsx,.xls" onChange={onFileChange} style={{ display: 'none' }} />
                                        <button class="btn btn-primary btn-sm me-2" onClick={onClickUpload} disabled={uploading}>
                                            {uploading ? (
                                                <>
                                                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <i class="fas fa-upload me-1"></i> Upload MFL
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                                <button class="btn btn-export btn-excel me-2" onClick={handleExportExcel} disabled={exporting}>
                                    {exporting ? (
                                        <>
                                            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <i class="fas fa-file-excel me-1"></i> Excel
                                        </>
                                    )}
                                </button>
                                {/* PDF export removed */}
                            </div>
                        </div>
                    </div>

                    <div class="table-container">
                        {uploadMsg && (
                            <div className="alert alert-info py-2">{uploadMsg}</div>
                        )}
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Facility ID</th>
                                        <th>Facility Name</th>
                                        <th>Level</th>
                                        <th>Ownership</th>
                                        <th>Authority</th>
                                        <th>SubCounty</th>
                                        <th>District</th>
                                        <th>Region</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                <div className="loading-spinner">Loading...</div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">
                                                No facilities found
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item) => (
                                            <tr key={item.id}>
                                                <td><div class="facility-code">{item.facility_id}</div></td>
                                                <td><div class="facility-name">{item.facility_name}</div></td>
                                                <td>{item.level}</td>
                                                <td>{item.ownership}</td>
                                                <td>{item.authority}</td>
                                                <td>{item.subcounty}</td>
                                                <td>{item.district}</td>
                                                <td>{item.region}</td>
                                                <td>
                                                    <Link to={`/${url}/${item.id}`}
                                                        class="action-btn btn-info" title="View Details">
                                                        <i className="fas fa-eye text-white"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <nav aria-label="Facilities pagination">
                            <ul class="pagination pagination-sm mb-0">
                                <li class={`page-item ${(pagination.page === 1 || !pagination.hasPreviousPage || paging) ? 'disabled' : ''}`}>
                                    <button 
                                        class="page-link" 
                                        onClick={() => handlePageChange(1)}
                                        disabled={pagination.page === 1 || !pagination.hasPreviousPage || paging}
                                    >
                                        First
                                    </button>
                                </li>
                                <li class={`page-item ${(!pagination.hasPreviousPage || paging) ? 'disabled' : ''}`}>
                                    <button 
                                        class="page-link" 
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={!pagination.hasPreviousPage || paging}
                                    >
                                        Prev
                                    </button>
                                </li>
                                <li class="page-item disabled">
                                    <span class="page-link">
                                        Page {pagination.page} of {pagination.totalPages || 1}
                                    </span>
                                </li>
                                <li class={`page-item ${(!pagination.hasNextPage || paging) ? 'disabled' : ''}`}>
                                    <button 
                                        class="page-link" 
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={!pagination.hasNextPage || paging}
                                    >
                                        {paging ? (
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            'Next'
                                        )}
                                    </button>
                                </li>
                                <li class={`page-item ${(pagination.page === pagination.totalPages || !pagination.hasNextPage || paging || pagination.totalPages === 0) ? 'disabled' : ''}`}>
                                    <button 
                                        class="page-link" 
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        disabled={pagination.page === pagination.totalPages || !pagination.hasNextPage || paging || pagination.totalPages === 0}
                                    >
                                        Last
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FacilityList