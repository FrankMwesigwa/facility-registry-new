import React from 'react';

const DocumentsSection = ({ request, openDocument }) => {
    const hasAny = request.operating_license || request.council_minutes || request.district_letter || request.support_document;
    if (!hasAny) return null;

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="content-section">
                        <div className="section-header">
                            <h5 className="section-title">
                                <i className="fas fa-file-alt"></i>
                                Uploaded Documents
                            </h5>
                        </div>
                        <div className="section-body">
                            {request.operating_license && (
                                <div className="info-item">
                                    <span className="info-label">Operating License</span>
                                    <span className="info-value">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => openDocument(request.operating_license)}
                                        >
                                            <i className="fas fa-eye"></i> View Document
                                        </button>
                                    </span>
                                </div>
                            )}
                            {request.council_minutes && (
                                <div className="info-item">
                                    <span className="info-label">Council Minutes</span>
                                    <span className="info-value">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => openDocument(request.council_minutes)}
                                        >
                                            <i className="fas fa-eye"></i> View Document
                                        </button>
                                    </span>
                                </div>
                            )}
                            {request.district_letter && (
                                <div className="info-item">
                                    <span className="info-label">District Letter</span>
                                    <span className="info-value">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => openDocument(request.district_letter)}
                                        >
                                            <i className="fas fa-eye"></i> View Document
                                        </button>
                                    </span>
                                </div>
                            )}
                            {request.support_document && (
                                <div className="info-item">
                                    <span className="info-label">Support Document</span>
                                    <span className="info-value">
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => openDocument(request.support_document)}
                                        >
                                            <i className="fas fa-eye"></i> View Document
                                        </button>
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

export default DocumentsSection;


