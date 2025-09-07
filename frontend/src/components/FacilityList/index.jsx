import React, { useState, useEffect, Fragment, useCallback } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import API from "../../helpers/api";
import FNModal from "../../components/FNModal";
import Filters from "./Filters";
import './styles.css'
import Search from "./Search";

const FacilityList = ({ url, link }) => {
    const [data, setData] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: filterValue,
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
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: Math.ceil((response?.data?.results || 0) / 20), // Use fixed value
                totalItems: response?.data?.results || 0
            }));
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    }, [filterValue, activeFilters]);

    // const downloadData = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const queryParams = new URLSearchParams({
    //             search: filterValue,
    //             ...activeFilters
    //         }).toString();

    //         const token = localStorage.getItem('token');
    //         const response = await API.get(`/facility/download/all?${queryParams}`, {
    //             headers: { Authorization: `Bearer ${token}` }
    //         });

    //         const transformedData = response.data.facilities.map(facility => ({
    //             id: facility.id,
    //             facility_id: facility.unique_identifier.slice(6),
    //             facility_name: facility.name,
    //             level: facility.level,
    //             ownership: facility.ownership,
    //             authority: facility.authority,
    //             subcounty: facility.SubCounty.name,
    //             district: facility.District.name,
    //             region: facility.Region.name,
    //         }));

    //         setFacilities(transformedData);
    //     } catch (error) {
    //         console.error('Error loading data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [filterValue, activeFilters]);

    useEffect(() => {
        fetchData();
    }, [activeFilters, fetchData]);

    const handleFilterChange = (value) => {
        setFilterValue(value);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        // Trigger search immediately when filter changes
        fetchData(1);
    };

    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(facilities);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Facilities");
        XLSX.writeFile(workbook, "uganda_mfl.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Add Header Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Ministry of Health Uganda', pageWidth / 2, 15, {
            align: 'center'
        });

        // Add subtitle
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Master Health Facility List', pageWidth / 2, 22, {
            align: 'center'
        });

        // Add current date
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.setFontSize(10);
        doc.text(`Printed on: ${currentDate}`, pageWidth - 15, 10, {
            align: 'right'
        });

        // Table headers
        const headers = [['Facility ID', 'Facility Name', 'Level', 'Ownership', 'Authority', 'SubCounty', 'District', 'Region']];
        const mfl = facilities.map(item => [
            item.facility_id,
            item.facility_name,
            item.level,
            item.ownership,
            item.authority,
            item.subcounty,
            item.district,
            item.region
        ]);

        // Add table
        autoTable(doc, {
            head: headers,
            body: mfl,
            startY: 30,
            margin: { top: 30 },
            styles: { overflow: 'linebreak' },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
        });

        // Add footer text
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Footer text
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128); // Gray color
            doc.text('System Generated Report', pageWidth / 2, pageHeight - 10, {
                align: 'center'
            });

            // Page numbers
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 10, {
                align: 'right'
            });
        }

        doc.save('uganda_mfl.pdf');
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
                <div class="container">
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
                                />
                            </div>
                            <div class="col-md-4 text-end mt-3 mt-md-0" style={{ padding: '0 1rem' }}>
                                <button class="btn btn-outline-primary btn-sm me-2" onClick={handleShow}>
                                    <i class="fas fa-filter"></i> Apply Filters
                                </button>
                                {/* <button class="btn btn-outline-secondary btn-sm">
                                    <i class="fas fa-times-circle"></i> Clear All
                                </button> */}
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
                                <span class="facility-count">(6,680 total)</span>
                            </h5>
                            <div class="export-buttons">
                                <button class="btn btn-export btn-excel" onClick={handleExportExcel}>
                                    <i class="fas fa-file-excel me-1"></i> Excel
                                </button>
                                <button class="btn btn-export btn-pdf" onClick={handleExportPDF}>
                                    <i class="fas fa-file-pdf me-1"></i> PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="table-container">
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
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default FacilityList