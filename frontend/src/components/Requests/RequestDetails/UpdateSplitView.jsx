import React from 'react';

const UpdateSplitView = ({ currentFacility, currentFacilityLoading, request, getStatusBadge, formatDate }) => {
    const normalize = (value) => (value ?? '').toString().trim().toLowerCase();
    const areEqualStrings = (a, b) => normalize(a) === normalize(b);
    const arraysEqualIgnoreOrder = (a, b) => {
        if (!Array.isArray(a) && !Array.isArray(b)) return true;
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        const as = [...a].map(normalize).sort();
        const bs = [...b].map(normalize).sort();
        for (let i = 0; i < as.length; i++) {
            if (as[i] !== bs[i]) return false;
        }
        return true;
    };

    const isDifferent = {
        name: () => !areEqualStrings(currentFacility?.name, request?.name),
        level: () => !areEqualStrings(currentFacility?.level, request?.level),
        ownership: () => !areEqualStrings(currentFacility?.ownership, request?.ownership),
        authority: () => !areEqualStrings(currentFacility?.authority, request?.authority),
        region: () => !areEqualStrings(currentFacility?.Region?.name || currentFacility?.region, request?.Region?.name),
        district: () => !areEqualStrings(currentFacility?.District?.name || currentFacility?.district, request?.District?.name),
        subcounty: () => !areEqualStrings(currentFacility?.SubCounty?.name || currentFacility?.subcounty, request?.SubCounty?.name),
        address: () => !areEqualStrings(currentFacility?.address, request?.address),
        gps: () => {
            const cLat = currentFacility?.latitude;
            const cLng = currentFacility?.longitude ?? currentFacility?.longtitude;
            const rLat = request?.latitude;
            const rLng = request?.longitude;
            return normalize(cLat) !== normalize(rLat) || normalize(cLng) !== normalize(rLng);
        },
        beds: () => normalize(currentFacility?.bed_capacity) !== normalize(request?.bed_capacity),
        services: () => !arraysEqualIgnoreOrder(currentFacility?.services || [], request?.services || []),
    };

    const updatedClass = (cond) => (cond ? ' bg-warning bg-opacity-25 rounded px-2' : '');
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-hospital me-2"></i>
                                Current Facility (MFL)
                            </h5>
                        </div>
                        <div className="section-body">
                            {currentFacilityLoading ? (
                                <div className="d-flex justify-content-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : currentFacility ? (
                                <>
                                    <div className="info-item">
                                        <span className="info-label">Facility Name</span>
                                        <span className="info-value">{currentFacility.name}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Level</span>
                                        <span className="info-value">{currentFacility.level || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Ownership</span>
                                        <span className="info-value">{currentFacility.ownership || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Authority</span>
                                        <span className="info-value">{currentFacility.authority || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Region</span>
                                        <span className="info-value">{currentFacility.Region?.name || currentFacility.region || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">District</span>
                                        <span className="info-value">{currentFacility.District?.name || currentFacility.district || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Sub County</span>
                                        <span className="info-value">{currentFacility.SubCounty?.name || currentFacility.subcounty || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Physical Address</span>
                                        <span className="info-value">{currentFacility.address || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">GPS Coordinates</span>
                                        <span className="info-value">
                                            {currentFacility.latitude && (currentFacility.longitude || currentFacility.longtitude)
                                                ? `${currentFacility.latitude}° N, ${(currentFacility.longitude || currentFacility.longtitude)}° E`
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Bed Capacity</span>
                                        <span className="info-value">{currentFacility.bed_capacity || 'N/A'}</span>
                                    </div>
                                    {Array.isArray(currentFacility.services) && currentFacility.services.length > 0 && (
                                        <div className="info-item">
                                            <span className="info-label">Services</span>
                                            <span className="info-value">
                                                <div className="services-container">
                                                    {currentFacility.services.map((s, i) => (
                                                        <span key={i} className="service-tag">{s}</span>
                                                    ))}
                                                </div>
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="alert alert-warning mb-0">Current facility not found in MFL.</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-edit me-2"></i>
                                Requested Updates
                            </h5>
                        </div>
                        <div className="section-body">
                            <div className="info-item">
                                <span className="info-label">Facility Name</span>
                                <span className={"info-value" + updatedClass(isDifferent.name())}>{request.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Level</span>
                                <span className={"info-value" + updatedClass(isDifferent.level())}>{request.level}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ownership</span>
                                <span className={"info-value" + updatedClass(isDifferent.ownership())}>{request.ownership}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Authority</span>
                                <span className={"info-value" + updatedClass(isDifferent.authority())}>{request.authority}</span>
                            </div>
                            {/* <div className="info-item">
                                <span className="info-label">Licensed</span>
                                <span className="info-value">{request.licensed || 'N/A'}</span>
                            </div> */}
                            {/* <div className="info-item">
                                <span className="info-label">Status</span>
                                <span className="info-value">{getStatusBadge(request.status)}</span>
                            </div> */}
                            {/* <div className="info-item">
                                <span className="info-label">Date Submitted</span>
                                <span className="info-value">{formatDate(request.createdAt)}</span>
                            </div> */}
                            <div className="info-item">
                                <span className="info-label">Region</span>
                                <span className={"info-value" + updatedClass(isDifferent.region())}>{request.Region?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">District</span>
                                <span className={"info-value" + updatedClass(isDifferent.district())}>{request.District?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Sub County</span>
                                <span className={"info-value" + updatedClass(isDifferent.subcounty())}>{request.SubCounty?.name || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Physical Address</span>
                                <span className={"info-value" + updatedClass(isDifferent.address())}>{request.address || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">GPS Coordinates</span>
                                <span className={"info-value" + updatedClass(isDifferent.gps())}>
                                    {request.latitude && request.longitude 
                                        ? `${request.latitude}° N, ${request.longitude}° E` 
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Bed Capacity</span>
                                <span className={"info-value" + updatedClass(isDifferent.beds())}>{request.bed_capacity || 'N/A'}</span>
                            </div>
                            {request.services && Array.isArray(request.services) && request.services.length > 0 && (
                                <div className="info-item">
                                    <span className="info-label">Services</span>
                                    <span className={"info-value" + updatedClass(isDifferent.services())}>
                                        <div className="services-container">
                                            {request.services.map((service, index) => {
                                                const isNew = !(currentFacility?.services || []).some(s => normalize(s) === normalize(service));
                                                const tagClass = "service-tag" + (isNew ? " bg-success bg-opacity-25" : "");
                                                return (
                                                    <span key={index} className={tagClass}>{service}</span>
                                                );
                                            })}
                                        </div>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateSplitView;


